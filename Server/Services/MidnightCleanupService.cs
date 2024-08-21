using Server.Data.Repositories;
using Server.Models;

namespace Server.Services
{
    public class MidnightCleanupService(IServiceScopeFactory serviceScopeFactory) : IHostedService
    {
        private Timer? _timer;

        private static int MillisecondsUntilMidnight() =>
            (int)(DateTime.Today.AddDays(1.0) - DateTime.Now).TotalMilliseconds;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(async _ => await DoWorkAsync(cancellationToken),
            null, MillisecondsUntilMidnight(), Timeout.Infinite);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Dispose();
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        private async Task DoWorkAsync(CancellationToken cancellationToken)
        {
            try
            {
                using IServiceScope scope = serviceScopeFactory.CreateScope();

                await CompleteUnfinishedTimeStamps(scope.ServiceProvider);
            }
            finally
            {
                _timer?.Change(MillisecondsUntilMidnight(), Timeout.Infinite);
            }
        }

        private static async Task CompleteUnfinishedTimeStamps(IServiceProvider provider)
        {
            var userRepository = provider.GetRequiredService<IUserRepository>();
            var timeStampRepository = provider.GetRequiredService<ITimeStampRepository>();

            var resultSet = await userRepository.GetAllAsync();
            foreach (var user in resultSet.Results)
            {
                var timeStamp = await timeStampRepository.GetLatestAsync(user.Username);
                if (timeStamp == null || timeStamp.TimeEnd != null)
                {
                    continue;
                }
                switch (user.WorkType)
                {
                    case WorkType.FullTime:
                        if (user.WorkTime == null)
                        {
                            user.WorkTime = 8;
                            await userRepository.UpdateAsync(user);
                        }
                        timeStamp.TimeEnd = timeStamp.TimeStart.AddHours((double)user.WorkTime);
                        break;

                    case WorkType.PartTime:
                        timeStamp.TimeEnd = DateTime.Today.AddSeconds(-1);
                        break;
                }
                await timeStampRepository.UpdateAsync(timeStamp);
            }
        }
    }
}