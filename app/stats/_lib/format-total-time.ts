export const formatTotalTime = (totalTimeInSeconds: number) => {
  const totalMinutes = Math.floor(totalTimeInSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${String(minutes).padStart(2, "0")}m`;
};
