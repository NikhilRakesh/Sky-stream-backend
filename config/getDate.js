export const getDate = ()=>{
    const now = new Date();
    const year = now.getFullYear(); // Get the current year
    const month = now.getMonth() + 1; // Get the current month (0-11, so add 1)
    const date = now.getDate(); // Get the day of the month
    const hour = now.getHours(); // Get the current hour (0-23)
    const minute = now.getMinutes(); // Get the current minute
    const second = now.getSeconds(); // Get the current second

    return  `${year}-${month}-${date} ${hour}:${minute}:${second}`;

}