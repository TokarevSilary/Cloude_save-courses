/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
      if (!localStorage.getItem('token')){
        let key =prompt('Введите ваш токен для Яндекс диска');
        localStorage.setItem('token', key);
      }
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){

    this.getToken();

    createRequest({
      method: 'POST',
      host: this.HOST,
      path: `resources/upload`,
      data: {
        path: path,
        url: url
      },
      callback
    });

  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){

    this.getToken();

    createRequest({
      method: 'DELETE',
      host: this.HOST,
      path: `resources`,
      data: {
        path: path,
      },
      callback
    });

  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    this.getToken();

    createRequest({
      method: 'GET',
      host: this.HOST,
      path: 'resources/files',
      data: {
        media_type: "image",
        sort: "created"
      },
      callback
    });

  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(path ){

    createRequest({
      method: 'GET',
      host: this.HOST,
      path: `resources/download`,
      data: {
        path: path,
      },
      callback: (err, response) => {
        if(err) {
          console.error(err);
          return;
        }

        const a = document.createElement('a');
        a.href = response.href;
        a.download

        document.body.appendChild(a);
        a.click();
        a.remove();


      }
    });


  }
}
