//spoller

// ----------------------------------------------------------------
   // для общего контейнера устанавливаем атрибут 
   //data-spollers="1000,max" или data-spollers
   //если нужен аккордеон то для общего блока ставим data-one-spoller
   //Для кнопки устанавливаем tabindex="-1" и data-spoller

   // <div (data-spollers) (data-one-spoller) class="block">
   //    <div class="block__item">
   //       <div (tabindex="-1") (data-spoller) class="block__title">Заголовок</div>
   //       <div class="block__text">
   //          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto saepe aspernatur velit, odit in culpa eius adipisci pariatur quae, perferendis recusandae modi, nobis atque asperiores quas! Harum dolores exercitationem numquam.
   //       </div>
   //    </div>
   // </div>

// ----------------------------------------------------------------

//получение обычных спойлеров
const spollerArray = document.querySelectorAll('[data-spollers]');
if(spollerArray.length > 0) {
   const spollerRegular = Array.from(spollerArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
   });
   
   //Инициализация обычных спойлеров
   if(spollerRegular.length > 0) {
      initSpollers(spollerRegular);
   }

   //Получение спойлеров с медиа запросом
   const spollerMedia = Array.from(spollerArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0];
   });

   //Инициализация спойлеров с медиа запросом
   if(spollerMedia.length > 0) {
      const breakepointsArray = [];
      
      spollerMedia.forEach(item => {
         const params = item.dataset.spollers;         
         const breakpoint = {};
         const paramsArray = params.split(",");
         breakpoint.value = paramsArray[0];
         breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
         breakpoint.item = item;
      
         breakepointsArray.push(breakpoint);
      });

      let mediaQueris = breakepointsArray.map(function(item){
         return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
      });
      mediaQueris = mediaQueris.filter(function (item, index, self) {
         return self.indexOf(item) === index;
      });

      //работа с каждым брейкпоинтом
      
      mediaQueris.forEach(breakpoint => {
         const paramsArray = breakpoint.split(",");
         const mediaBreakpoint = paramsArray[1];
         const mediaType = paramsArray[2];
         const matchMedia = window.matchMedia(paramsArray[0]);

         //объекты с нужными условиями
         const spollersArray = breakepointsArray.filter(function(item){
            if(item.value === mediaBreakpoint && item.type === mediaType) {
               return true;
            }
         });
         // событие
         matchMedia.addListener(function (){
            initSpollers(spollersArray, matchMedia);
         });
         
         initSpollers(spollersArray, matchMedia);
      });
   }

   //инициация
   function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
         spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
   
         if(matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add('_init');
            initSpollersBody(spollersBlock);
            spollersBlock.addEventListener('click', setSpollerAction);
         }else{
            spollersBlock.classList.remove('_init');
            initSpollersBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
         }
      });
   }

   //работа с контентом
   function initSpollersBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitels = spollersBlock.querySelectorAll('[data-spoller]');
      if(spollerTitels.length > 0) {
         
         spollerTitels.forEach(spollerTitel => {
            if(hideSpollerBody) {
               spollerTitel.removeAttribute('tabindex');
               if(!spollerTitel.classList.contains('._spoller-active')) {
                  spollerTitel.nextElementSibling.hidden = true;
               }
            }else{
               spollerTitel.setAttribute('tabindex', '-1');
               spollerTitel.nextElementSibling.hidden = false;
            }
         });
      }
   }

   function setSpollerAction(e) {
      const el = e.target;
      if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
         const spollerTitel = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
         const spollersBlock = spollerTitel.closest('[data-spollers]');
         const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
         if(!spollersBlock.querySelectorAll('._slide').length) {
            if(oneSpoller && !spollerTitel.classList.contains('_spoller-active')) {
               hideSpollerBody(spollersBlock);
            }
            spollerTitel.classList.toggle('_spoller-active');
            _slideToggle(spollerTitel.nextElementSibling, 500);
            
            
         }
         e.preventDefault();
      }
   }

   function hideSpollerBody (spollersBlock) {
      const SpollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
      if(SpollerActiveTitle) {
         SpollerActiveTitle.classList.remove('_spoller-active');
         _slideUp(SpollerActiveTitle.nextElementSibling, 500);
      }
   }
}

//slideToggle
let _slideUp = (target, duration = 500) => {
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
         target.hidden = true;
         target.style.removeProperty('height');
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-tom');
         target.style.removeProperty('margin-bottom');
         // target.style.removeProperty('display');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
         target.style.removeProperty('display');
      }, duration);
   }
}
let _slideDown = (target, duration = 500) => {
   
   target.style.display = 'flex';
   if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      if (target.hidden) {
         target.hidden = false;
      }

      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-tom');
      target.style.removeProperty('margin-bottom');
      // target.style.removeProperty('display');
      window.setTimeout(() => {
         target.style.removeProperty('height');
         target.style.removeProperty('overflow');
         target.style.removeProperty('transition-duration');
         target.style.removeProperty('transition-property');
         target.classList.remove('_slide');
      }, duration);
   }
}

let _slideToggle = (target, duration = 500) => {
   if (target.hidden) {
      return _slideDown(target, duration);
   } else {
      return _slideUp(target, duration);
   }
}