/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;

    this.input = this.element.querySelector('input');
    this.Btns = this.element.querySelectorAll('.button');
    this.registerEvents();
  }
  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    this.Btns.forEach(btn =>
        btn.addEventListener('click', (event)=> {
          if (event.target.classList.contains('add') && this.input.value !== '') {
              let callback = (massive) => {
                  App.imageViewer.drawImages(massive);
              };
            this.OurIdUser = this.input.value;
            VK.get(this.OurIdUser, callback)
          }else if (event.target.classList.contains('replace') && this.input.value !== '') {
                App.imageViewer.clear()
                  let callback = (massive) => {
                      App.imageViewer.drawImages(massive);
                  };
                this.OurIdUser = this.input.value;
                VK.get(this.OurIdUser, callback)
            }
        }
        )
    )
  }

}