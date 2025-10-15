export default function getDayOrNightIcon(iconName: string, dateTimeString: string): string {
    const hour = new Date(dateTimeString).getHours();
    const isDayTime = hour >= 6 && hour < 18;
    return isDayTime ? iconName.replace(/.$/, 'd') : iconName.replace(/.$/, 'n');
}