window.categories = {};
window.tobox_pictures = 'pictures';
window.required = ['pictures','title','description','price']
window.messages = {'not_selected': 'Not selected'};

window.processing_upload = false;

window.translations = {
	'en': {
		'tobox_uuid': 'Tobox UUID (for update)',
		'picture': 'Picture',
		'title': 'Title',
		'description': 'Description',
		'visibility': 'Visibility',
		'price': 'Price',
		'vendor_code': 'Vendor code',
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
		'importer': 'importer',
		'status': 'Status',
		'time': 'Time',
		'message': 'Message',
		'data': 'Data',
		'no_changes': 'Product already in tobox. No changes.',
		'updating_product': 'Updating existing product',
		'uploading_product': 'Uploading product',
		'task_started': 'Uploading products task starter',
		'product_upload_problem': 'Product upload problem',
		'product_uploading_success': 'Product uploading success',
		'product_updating_success': 'Product updating success',
		'image_upload_problem': 'Image uploading problem',
		'uploaded': 'Uploaded',
		'updated': 'Updated',
		'failed': 'Failed',
		'finish': 'Uploading products task finished',
		'internal_error': 'Internal error',
		'yml_category_id': 'YML category ID',
		'finish_with_error': 'Uploading products task finished with error',
		'bad_image_url': 'Bad image URL',
		'bad_price_format': 'Bad price format'
	},
	'ru': {
		'tobox_uuid': 'Tobox UUID (для обновления)',
		'picture': 'Картинка',
		'title': 'Заголовок',
		'description': 'Описание',
		'visibility': 'Видимость',
		'price': 'Цена',
		'vendor_code': 'Артикул производителя',
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
		'importer': 'импортер',
		'status': 'Статус',
		'time': 'Время',
		'message': 'Сообщение',
		'data': 'Данные',
		'no_changes': 'Данный продукт уже есть в tobox. Нет изменений.',
		'updating_product': 'Обновление существующего продукта',
		'task_started': 'Идет загрузка продуктов',
		'uploading_product': 'Загрузка продукта',
		'product_upload_problem': 'Проблема при загрузке продукта',
		'product_uploading_success': 'Продукт загружен успешно',
		'product_updating_success': 'Продукт обновлен успешно',
		'image_upload_problem': 'Проблема при загрузке картинки',
		'uploaded': 'Загружено',
		'updated': 'Обновлено',
		'failed': 'Ошибки',
		'finish': 'Загрузка продуктов закончена',
		'internal_error': 'Внутренняя ошибка',
		'yml_category_id': 'ID категории из YML',
		'finish_with_error': 'Загрузка продуктов закончена с ошибкой',
		'bad_image_url': 'Неверный формат URL картинки',
		'bad_price_format': 'Неверный формат цены'
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

window.tobox_uuid = {'name': window.translate('tobox_uuid'), 'value': 'id'};

window.products = {}

window.products[window.translate('picture')] = 'pictures';
window.products[window.translate('title')] = 'title';
window.products[window.translate('description')] = 'description';
window.products[window.translate('visibility')] = 'hidden';
window.products[window.translate('price')] = 'price';
window.products[window.translate('vendor_code')] = 'vendorCode';