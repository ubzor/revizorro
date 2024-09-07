import { useScheduler } from "#scheduler";

export default defineNitroPlugin(() => {
  const scheduler = useScheduler();

  scheduler
    .run(async () => {
      await lucia.deleteExpiredSessions();

      // TODO: delete expired registration confirmation codes from database
    })
    .hourly();
});
