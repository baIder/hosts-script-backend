export const getFormattedDate = () => {
    const date = new Date();

    // 获取年、月、日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份需要 +1，并格式化为两位数
    const day = String(date.getDate()).padStart(2, "0"); // 日期格式化为两位数

    // 拼接成 YYYY-MM-DD 格式的字符串
    return `${year}-${month}-${day}`;
};
