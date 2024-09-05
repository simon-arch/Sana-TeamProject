using Server.Data.Extensions;
using Server.Data.Repositories;
using Server.Models;

namespace Server.Services
{
    public class TimeStampAutoStopService(IServiceScopeFactory serviceScopeFactory) : BackgroundService
    {   
        private readonly TimeSpan _period = TimeSpan.FromMinutes(5);

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            using var timer = new PeriodicTimer(_period);
            while (!cancellationToken.IsCancellationRequested && 
                await timer.WaitForNextTickAsync(cancellationToken))
            {
                try
                {
                    using IServiceScope scope = serviceScopeFactory.CreateScope();
                    var provider = scope.ServiceProvider;

                    var timeStampRepo = provider.GetService<ITimeStampRepository>();

                    var resultSet = await provider.GetRequiredService<IUserRepository>().GetAllAsync(options =>
                        options.OfWorkType(WorkType.FullTime));

                    var dayStart = DateTime.Today.ToUniversalTime();
                    var dayEnd = DateTime.Today.AddDays(1).AddSeconds(-1).ToUniversalTime();

                    foreach ( var user in resultSet.Results )
                    {
                        var latest = await timeStampRepo!.GetLatestAsync(user.Username);

                        if (latest == null || latest.TimeEnd != null) continue;

                        var timeStamps = await timeStampRepo.GetByInterval(dayStart, dayEnd, user.Username);

                        double todayTotalTime = 0;

                        foreach ( var timeStamp in timeStamps )
                        {
                            if (timeStamp.Id == latest.Id ) continue;

                            todayTotalTime += (timeStamp.TimeEnd! - timeStamp.TimeStart).Value.TotalSeconds;
                        }

                        var currentTotalTime = (DateTime.UtcNow - latest.TimeStart).TotalSeconds;
                        var overTime = todayTotalTime + currentTotalTime - (double)user.WorkTime! * 3600;

                        if (todayTotalTime < (double)user.WorkTime! * 3600 && overTime >= 0)
                        {
                            latest.TimeEnd = latest.TimeStart.AddSeconds((double)user.WorkTime * 3600 - todayTotalTime);
                            latest.Source = Source.SYSTEM;
                            await timeStampRepo.UpdateAsync(latest);
                        }
                    }
                }
                catch { }
            }
        }
    }
}
