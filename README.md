# Стартовый шаблон

Стартовый шаблон для простой верстки и верстки для bitrix'а. По умолчанию простая верстка, для битрикса надо указать директорию шаблона в файле `gulpfile.js` в объекте `settings`. В нем же список задач для запуска и настройки сборки.

Установка:
```
npm i --unsafe-perm
bower i --allow-root
```

Запустить сборку + наблюдение за изменением файлов:
```
gulp
```

Запустить только сборку:
```
gulp build
```

Запустить отдельную задачу:
```
gulp html:build
gulp js:build
gulp css:build
gulp fonts:build
gulp sprites:build
gulp images:build
gulp uploads:build
gulp mdrnzr:build
gulp sprites-png:build
```

## Структура файлов

- source - исходники проекта
	- .congif
	- fonts
	- html
	- images
	- js
	- scss
	- sprites
	- sprites-png
	- uploads
- www - скомпилированные файлы

### .config

- `modernizr.json` - https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json
- `sprites-template.*` - шаблоны для генерации спрайтов, генерятся с именами `sprites.*` в соответствующих директориях

### fonts

просто файлы шрифтов\
в `scss/_fonts.scss` идет подключение

### html

- `layouts` - шаблоны страниц, не компилируются
- `pages` - отдельные страницы, которые компилируются в html
	- `ajax/*` - формы, обработка ajax'а, подгружаемые вьюхи
	- `_blank.pug` - болванка для новой страницы
- `sprites.pug` - файл с миксинами для спрайтов, генерится автоматически
- `variables.pug` - глобальные переменные

### images

Графика для проекта\
`sprites.svg` - компилируется автоматом, этот файл нужно встроить в готовую страницу (php include)

### js

- `plugins.js` - файл с подключением внешних плагинов
- `остальное` - свой код

### scss

- `components/*` - файлы для компонентов
- `layouts/*` - файлы для обвязки
- `_variables.scss` - переменные для проекта
- `_sprites.scss` - файл с классами для спрайтов, генерится автоматически
- `_mixins.scss` - файл с миксинами scss
- `_functions.scss` - файл с функциями scss
- `_base.scss` - стили для стандартных элементов (параграфы, списки, таблицы etc)
- `_controls.scss` - стили для полей ввода, чекбоксов, etc. Здесь же стили для стилизации контролов, через плагины
- `_forms.scss` - стили для оформления непосредственно форм
- `_plugins.scss` - файл с переопределением стандартных стилей плагинов под проект
- `styles.scss, template_styles.scss` - файлы, которые будут скомпилированы, в них подключаются все остальные файлы и *стандартные стили для плагинов*

### sprites
Отдельные svg иконок, компилируются в общий файл `images/sprites.svg`, который подключается на страницу.\
Подключение на страницу:
```
<svg class="icon icon-FILE_NAME"><use xlink:href="#icon-FILE_NAME"></svg>
```
или через pug-миксин
```
+icon-FILE_NAME('можно передать доп. класс')
```
В самих svg-файлах надо убрать всё лишнее (width, height, fill etc).

### sprites-png
По аналогии с svg-спрайтами, отдельные файлы, которые склеются в один. Чтобы использовать одновременно, надо изменить gulp-задачи, т.к. используется одинаковый scss-файл.


### uploads
Временная графика для верстки (картинки товаров, галереи etc).