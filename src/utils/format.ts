export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatUptime(days: number): string {
  if (days < 1) {
    const hours = Math.floor(days * 24);
    const minutes = Math.floor((days * 24 - hours) * 60);
    return `${hours}h ${minutes}m`;
  }
  
  const wholeDays = Math.floor(days);
  const hours = Math.floor((days - wholeDays) * 24);
  
  if (wholeDays === 1) {
    return `${wholeDays} day ${hours}h`;
  }
  
  return `${wholeDays} days ${hours}h`;
}