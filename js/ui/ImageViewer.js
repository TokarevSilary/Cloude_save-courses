// import * as url from "node:url";

/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.actionBtn = element.querySelectorAll('.row .button');
    this.prewire = element.querySelector('.wide .image');
    this.imgeContainer = element.querySelector(".images-list .row");

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    let count = 0;
    let timeClick;

    this.actionBtn.forEach(btn => {
      btn.addEventListener('click', (event) => {
        if(event.target.classList.contains('select-all')){
          const images = this.imgeContainer.querySelectorAll('.image-wrapper img');
          const selected = this.imgeContainer.querySelectorAll('.image-wrapper img.selected');
          if(selected.length >= 1){
            [...images].forEach((image) => {
              image.classList.remove('selected');
            })
          }else if (selected.length === 0){
            [...images].forEach((image) => {
              image.classList.add('selected');
            })
          }

          this.checkButtonText()
        }else if(event.target.classList.contains('show-uploaded-files')){
          const modal = App.getModal('filePreviewer');
          modal.open();
          let callback = () => {
            modal.showImages()
          }
          Yandex.getUploadedFiles((data)=>{
            modal.showImages(data);
          });
        }else if (event.target.classList.contains('send')) {
          const modal = App.getModal('fileUploader');
          const selected = this.imgeContainer.querySelectorAll('.image-wrapper img.selected');
          const images = [...selected].map(img => ({
            url: img.src
          }));
          modal.showImages(images)
          modal.open();
        }
      })
    })

    this.imgeContainer.addEventListener('click', (event) => {
      if(event.target.tagName === 'IMG'){
        count++;
        clearTimeout(timeClick);
        let img = event.target;
        img.classList.toggle('selected');
        this.checkButtonText();
        timeClick = setTimeout(()=>{
              if(count === 2){
                this.prewire.src = img.src;
                console.log(this.prewire)
              }
              count = 0;
            }
            , 300)
      }
    })


  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imgeContainer.innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    images.forEach(element=> {
      let btnSelected = [...this.actionBtn].find(elem => elem.classList.contains('select-all'));
      if(images.length > 0){
        btnSelected.classList.remove('disabled');
      }else btnSelected.classList.add('disabled');
      let wrapper = document.createElement("div");
      wrapper.classList.add(
          'four',
          'wide',
          'column',
          'ui',
          'medium',
          'image-wrapper'
      );
      let img = document.createElement('img');
      img.src = element.url;
      // img.style.width = 200 + 'px';
      // img.style.width = element.width + 'px';
      wrapper.appendChild(img);
      this.imgeContainer.insertBefore(wrapper, this.imgeContainer.lastChild);
  }
  )}

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    const images = this.imgeContainer.querySelectorAll('.image-wrapper img');
    const selected = this.imgeContainer.querySelectorAll('.image-wrapper img.selected');

    let btnSend = [...this.actionBtn].find(elem => elem.classList.contains('send'));
    btnSend.classList.remove('disabled');


    let btnSelected = [...this.actionBtn].find(elem => elem.classList.contains('select-all'));
    if (images.length === 0) {
      btnSend.classList.add('disabled');
      btnSelected.textContent = 'Выбрать всё';
      // btnSelected.classList.add('disabled');
      return;
    }

    if (images.length > 0 && selected.length === images.length) {
      btnSelected.innerHTML = 'Снять выделение';
    }else {
      btnSelected.innerHTML = 'Выбрать всё';
    }

    if (selected.length > 0) {
      btnSend.classList.remove('disabled');
    } else {
      btnSend.classList.add('disabled');
    }
  }

}