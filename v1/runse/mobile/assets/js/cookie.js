function setCookie(name, value, daysToLive) {
    let cookie = name + "=" + encodeURIComponent(value);
    if (typeof daysToLive === "number") {
        cookie += "; max-age=" + (daysToLive*24*60*60); // 将天数转换为秒数
    }
    document.cookie = cookie;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [cookieName, cookieValue] = cookies[i].split("=");
        if (name === cookieName) {
            return decodeURIComponent(cookieValue);
        }
    }
    return "";
}