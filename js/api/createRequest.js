/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const aouth = localStorage.getItem('token');
    const xhr = new XMLHttpRequest;
    let url = `${options.host}/${options.path}`;
    if(options.data){
        const params = new URLSearchParams(options.data).toString()
        url += `?${params}`;
    }

    xhr.open( options.method, url );
    xhr.setRequestHeader('Authorization', 'OAuth ' + aouth);
    xhr.responseType = 'json'
    xhr.onload = (e) => {
        if(xhr.status >= 200 && xhr.status < 300){
            options.callback(xhr.response);
        }
    }
    try {
        xhr.send();
    }catch(err) {
        console.log(err);
    }

};
