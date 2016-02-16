window.categories = {};
window.tobox_uuid = {'name': 'Tobox UUID (for update)', 'value': 'id'};
window.tobox_pictures = 'pictures';
window.products = {'Картинка': 'pictures', 'Заголовок': 'title', 'Описание': 'description', 'Видимость': 'hidden', 'Цена': 'price'};
window.required = ['pictures','title','description','price']
window.messages = {'not_selected': 'Not selected'};

window.translations = {
	'en': {
		'not_selected': 'Not selected',
		'assign_categories': 'Assign categories to tobox',
		'assign_product_params': 'Assign <param> elements of <offer>',
		'assign_attribute': 'Assign attributes and element of <offer>',
		'add': 'Add',
		'user_categories': 'User categories',
		'tobox_categories': 'Tobox categories',
		'update': 'Update',
		'delete': 'Delete',
		'login_button': 'Login',
		'login': 'Login:',
		'password': 'Password:',
		'file_selection': 'File selection',
		'settings': 'Settings',
		'configure_data': 'Configure data',
		'success': 'Success',
		'default_category': 'Default category',
		'upload': 'Upload',
		'check_relations': 'Check required relations',
		'for_sheet': 'for sheet',
		'error': 'Error',
		'info': 'Info',
		'primary_key': 'Primary key',
		'autoupdate': 'Autoupdate',
		'save': 'Save',
		'scan': 'Scan',
		'file_or_url_selection': 'File or url selection',
		'please_select_file_or_url': 'Please select file or set correct URL to your YML',
		'product_tobox_parameters': 'Tobox parameter',
		'product_attribute_name': 'Attribute or element name in <offer>',
		'param_name_in_yml': 'Element <param> name of <offer>',
		'failed_to_load_file': 'Failed to load file',
		'categories_relations': 'Categories relations',
		'importer': 'importer'
	},
	'ru': {
		'not_selected': 'Не выбрано',
		'assign_categories': 'Установить соответствия категорий с tobox',
		'assign_product_params': 'Установить соответствия элементов <param> в <offer>',
		'assign_attribute': 'Установить соответствия атрибутов и элементов в <offer>',
		'add': 'Добавить',
		'user_categories': 'Пользовательские категории',
		'tobox_categories': 'Категории в tobox',
		'update': 'Обновить',
		'delete': 'Удалить',
		'login_button': 'Войти',
		'login': 'Логин:',
		'password': 'Пароль:',
		'file_selection': 'Выбор файла',
		'settings': 'Настройки',
		'configure_data': 'Конфигурация данных',
		'success': 'Успешно',
		'default_category': 'Категория по умолчанию',
		'upload': 'Загрузить',
		'check_relations': 'Проверьте наличие требуемых соответсвий',
		'for_sheet': 'для листа',
		'error': 'Ошибка',
		'info': 'Информация',
		'primary_key': 'Первичный ключ',
		'autoupdate': 'Автообновление',
		'save': 'Сохранить',
		'scan': 'Сканировать',
		'file_or_url_selection': 'Выбор файла или url',
		'please_select_file_or_url': 'Пожалуйста выберите файл или URL',
		'product_tobox_parameters': 'Параметр tobox',
		'product_attribute_name': 'Имя атрибута или элемента в <offer>',
		'param_name_in_yml': 'Имя элемента <param> в <offer>',
		'failed_to_load_file': 'Ошибка загрузки файла',
		'categories_relations': 'Соответствия категорий',
		'importer': 'импортер'
	}
}

window.translate = function(tag) {
	var lang = '';
	if (navigator.language != undefined) {
		lang = navigator.language;
	}
	else if (navigator.languages != undefined) {
		lang = navigator.languages[0];
	}
	if (lang != '') {
		lang = lang.split('-')[0];
	}

	if (!(lang in window.translations)) {
		lang = 'en';
	}

	return window.translations[lang][tag];
}
