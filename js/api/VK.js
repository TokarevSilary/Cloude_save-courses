
/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = prompt("Введите VK Access Token");
  static lastCallback;

  static currentScript;


  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;

    this.currentScript = document.createElement('script');

    this.currentScript.src =
        "https://api.vk.com/method/photos.get" +
        "?owner_id=" + id +
        "&album_id=profile" +
        "&access_token=" + VK.ACCESS_TOKEN +
        "&v=5.199" +
        "&callback=VK.processData";

    document.body.appendChild(this.currentScript);

  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    if (result.error) {
      alert(`Ошибка VK: ${result.error.error_msg}`);
      this.lastCallback = () => {};
      return;
    }

    if (!result.response || !result.response.items) {
      alert('Не удалось получить изображения');
      this.lastCallback = () => {};
      return;
    }
    let ourImgLargest = [];

    const ourImg = result.response.items;

    ourImg.forEach((img) => {

      const largest = img.sizes.reduce((max, item) => {
        return item.width > max.width ? item : max;
      });
      ourImgLargest.push({
        url: largest.url,
        width: largest.width
      });
    });

    this.currentScript.remove();
    this.lastCallback(ourImgLargest);
    this.lastCallback = ()=>{};
  }
}
