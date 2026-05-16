/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
   super(element);
    this.content = this.domElement.querySelector('.content');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.domElement.addEventListener('click', (e) => {
      if(e.target.classList.contains('x') &&
          e.target.classList.contains('icon')
      )this.close();
      if(e.target.classList.contains('delete')) {
        let containerDelete = e.target.closest('.image-preview-container');
        let path = e.target.getAttribute('data-path');
        Yandex.removeFile(path, (err, response) => {
          if (err) {
            console.error(err);
            return;
          }
          containerDelete.remove();
        })
      }
      if(e.target.classList.contains('download')) {
        let containerOur = e.target.closest('.image-preview-container');
        let path = e.target.getAttribute('data-path');
        Yandex.downloadFileByUrl(path , name.textContent.replace('.jpg', ''))
      }
    })

  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    let containerImg = this.domElement.querySelector('.scrolling.content');

    if (!data || !data.items) {
      containerImg.innerHTML = '';
      return;
    }

      containerImg.innerHTML = data.items
          .reverse()
          .map( (image)  =>  this.getImageInfo(image)).join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const time = new Date(date);

    return  time.toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      }
    );
  }



  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    const img = (item.sizes || []).find(img => img.name === "M");
    const original =(item.sizes || []).find(img => img.name === "ORIGINAL");
    return `
    
    <div class="image-preview-container">
  <img src=${img ? img.url : item.preview} />
  <table class="ui celled table">
  <thead>
    <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
  </thead>
  <tbody>
    <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${item.size}Кб</td></tr>
  </tbody>
  </table>
  <div class="buttons-wrapper">
    <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
      Удалить
      <i class="trash icon"></i>
    </button>
    <button class="ui labeled icon violet basic button download" data-file='
      ${original ? original.url : (img ? img.url : item.preview)}
      ' data-path='${item.path}' >
      Скачать
      <i class="download icon"></i>
    </button>
  </div>
</div>
    
    `
  }
}
