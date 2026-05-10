/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal{
  constructor( element ) {
    super(element);
    this.content = this.domElement.querySelector('.content');
    this.registerEvents();


  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.domElement.addEventListener('click', e => {
      if ((e.target.classList.contains('x') &&
          e.target.classList.contains('icon')) || (
          e.target.classList.contains('close') &&
          e.target.classList.contains('button')
      )
      ) {
        this.close();
      }


      if (((e.target.classList.contains('ui')&&
          e.target.classList.contains('button')) &&
          e.target.querySelector(".upload.icon")) ||
          (e.target.classList.contains('upload')&&
           e.target.classList.contains('icon'))) {
        const inputDivElement = e.target.closest('.input');
        const divInput = inputDivElement
            .querySelector('input');

        if (divInput.value.trim() === '') {
          inputDivElement.classList.add('error');
        }
        divInput.onclick = () => {
          if(inputDivElement.classList.contains('error')){
            inputDivElement.classList.remove('error');
          }
        }
        const imageContainer = e.target.closest('.image-preview-container');
        this.sendImage(imageContainer)

      }
      if(e.target.classList.contains('send-all')){
        let btns =this.content.querySelectorAll('.icon.upload');
        btns.forEach(btn => {
          btn.click();
        })
      }
    })
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    let containerImg = document.querySelector('.scrolling.content');

    containerImg.innerHTML = images
        .reverse()
        .map( ( image ) => this.getImageHTML(image.url)).join('');
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
      <img src="${item}" />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button">
          <i class="upload icon"></i>
        </button>
      </div>
    </div>
  `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {

  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */

// <div class="image-preview-container">
// <img src="https://sun9-23.userapi.com/s/v1/ig2/gPT4jUfMxb1Cei8ylXEj66ILybhQcFYoS4XDaOfm1fWWseQLE6mNafg0BtifISFCe0COs3SU7FNBUzUsarnoxQSc.jpg?quality=95&amp;as=32x40,48x60,72x90,108x135,160x200,240x301,360x451,480x601,540x677,640x802,720x902,1080x1353,1280x1604,1440x1804,2043x2560&amp;from=bu&amp;cs=2043x0">
// <div class="ui action input">
// <input type="text" placeholder="Путь к файлу">
// <button class="ui button">
// <i class="upload icon"></i>
// </button>
// </div>
// </div>
  sendImage(imageContainer) {
    if(!imageContainer.querySelector('.input').classList.contains('error')){
      const path = imageContainer.querySelector('input').value.trim();
      const urlImage = imageContainer.querySelector('img').src;
      Yandex.uploadFile(path, urlImage, (response)=>{
        imageContainer.remove();
        if(this.content.querySelectorAll(".image-preview-container").length === 0){
          this.close()
        }
      });
    }

  }
}