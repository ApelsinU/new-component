# **RU**

**Установка**
1. Склонировать репозиторий в любую папку
2. Добавить конфиг `.new-component-config.json` в домашнюю папку `home` - пока что он глобальный и один для всех проектов.
3. Выбрать конфиг из примеров или написать свой (CTRL + H (Linux) -  показать скрытые файлы, если файл конфига не отображается)

**Использование**
1. В проекте: Открыть в терминале папку, в к-й хотим создать компонент (отдельно папку для компонента создавать не надо)
2. В терминале: `new-component ComponentName`
 
**Примеры конфига**
1.  Bookie-v4 ( **jsx + stylus** ):
```JSON
   {
       "dir":".",
       "dirNameStyle": "snakeCase",
       "lang": "jsx",
       "style": "styl",
       "cssClassesName": "styleName"
   }
```
 
2. Best Practice ( **tsx + css-modules** ):
```JSON
   {
       "dir": ".",
       "dirNameStyle": "pascalCase",
       "lang": "tsx",
       "style": "scss",
       "cssModule": true
   }
```

# **EN**

**Install**

1. Clone repository to your PC
2. Add `.new-component-config.json` to `home` directory
3. Choose config from examples or create your own (CTRL + H (Linux) - to show hidden files, if config invisible)

**Usage**
(You can use it anywhere, in all projects on PC)
1. Open folder in terminal
2. Run `new-component` ComponentName
