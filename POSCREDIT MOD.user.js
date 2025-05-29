// ==UserScript==
// @name         POSCREDIT MOD
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Мод для POSCREDIT
// @author       wofiku
// @match        https://*.b2pos.ru/*
// @grant        window.onurlchange
// ==/UserScript==
'use strict'; // Включение "строгого режима". Подр.: https://learn.javascript.ru/strict-mode


// -------
// ФУНКЦИИ
// -------
// JS w/o monkey job
// Допиливаем JS, потому что "библиотек нет, но вы держитесь"
// Переменную в число
function mod_el_to_num(variable){
	return variable.toString().replaceAll(/\D/g, "") | 0 // Выводим только цифры, или, если их нет, - выводим 0, чтобы не получать пустое значение
};

// Попробовать запустить функцию, или вывести в консоль ошибку при неудаче
function mod_try_catch(func){
	try {func} catch (error) {console.error(error)}; // ПОТОМУ ЧТО JS СРАЗУ КРАШИТ ВЕСЬ СКРИПТ ВМЕСТО ВЫВОДА ОШИБКИ АААААА
};

// URL разбитый
function url_elements(url){
	return url.toString().replace('https://', '').replace('http://', '').split('/') // Выводит список. Убираем "http(s)://", разделяем по "/"
};

// URL в имя домена или IP-адрес
function url_name(url){
	return url_elements(url)[0] // Выбираем только доменное имя/IP-адрес
};

// Находилки
// Найти элемент el (поиск по умолчанию)
function html_find(el){
	return document.querySelector(el);
};
// Найти элемент по его классу
function html_find_class(el_class){
	return html_find(`.${el_class}`);
};
// Найти элемент по его ID
function html_find_id(el_id){
	return document.getElementById(el_id);
};

// Добавлялки
// Найти и добавить к найденному элементу
function mod_find_add(to_elem, html_to_add){
	let __finding_element = html_find(to_elem);
	if (__finding_element){
		__finding_element.insertAdjacentHTML('afterend', html_to_add);
	};
};
// Добавить класс к элементу
function html_add_class(el, class_to_add){
	el.classList.add(class_to_add)
};
// CSS: добавить стиль
function css_add_style(style_str){
	// mod_css - расположение styleSheets (CSS файла на фронте); style_str - строка CSS стиля; попробовать добавить последним в списке
	mod_try_catch(mod_css.insertRule(style_str, mod_css.cssRules.length));
};

// ----------
// ПЕРЕМЕННЫЕ
// ----------
// На каком сайте сейчас
const mod_current_url = document.location.href;
const mod_current_url_elements = url_elements(mod_current_url);
const mod_current_site = url_name(mod_current_url);
const mod_css = document.styleSheets[0];


// --------------------
// ОБЩИЕ МОДЫ POSCREDIT
// --------------------
// TODO
// Убрать logout
// bank: несмешная менюшка для вызова ВСЕХ МЕТОДОВ АААААААААААААА


// УБРАТЬ ЛОГАУТ
//const logout_window = document.querySelector('.logoutWindow');
//if (logout_window){
//	logout_window.remove()
//}



// ----------
// bank.b2pos
// ----------
if (mod_current_site == 'bank.b2pos.ru'){
	// ФУНКЦИИ
	// ВЕРНУТЬ копируемость текста в шапке заявки
	const bank_header_css = document.styleSheets[3]; // Нужный нам CSS

	for (let i = 0; i < bank_header_css.cssRules.length; i++) {
		if (bank_header_css.cssRules[i].selectorText == '.search-results-table__cell-content-value'){
			bank_header_css.cssRules[i].style.userSelect = 'all';
			break;
		};
	};

	// Перепрыгнуть в заявку
	function mod_blank_jump(blank_id){
		window.location.href = `/search/profile${blank_id}/`;
	};
	// СТИЛИ
	// Общий стиль
	const mod_style_main = `.mod_main{
		position: relative;
		display: flex;
		color: black;
		font-weight: 400;
		font-size: 26px;
		font-weight: normal;
		white-space: nowrap;
	}`;
	css_add_style(mod_style_main);

	// Выбранный (выделенный) объект
	const mod_style_selected = `.mod_selected{
		background-color: var(--color-main, #e86f2d);
		border: none;
		color: white;
	}`;
	css_add_style(mod_style_selected);

	// Контейнер
	const mod_style_div = `.mod_div{
		height: 64px;
		padding: 0 24px;
	}`;
	css_add_style(mod_style_div);

	// Поле
	const mod_style_field = `.mod_field{
		flex-direction: column;
		min-width: 128px;
		max-width: 350px;
		background-color: white;
		border: 2px solid var(--input_border, rgba(0, 0, 0, 0.2));
		border-radius: 24px;
	}`;
	css_add_style(mod_style_field);

	// Поле поиска
	const mod_style_field_search = `.mod_field_search{border-radius: 24px 0 0 24px;}`;
	css_add_style(mod_style_field_search);

	// Текст поля
	const mod_style_field_input = `.mod_field_input{
		font-size: 22px;
		line-height: 24px;
		border: none;
		outline: none;
		height: 24px;
		padding: 0;
		color: var(--input_color, black);
	}`;
	const mod_style_field_input_placeholder = `.mod_field_input::placeholder{
		color: var(--color-grey7B, #7b7b7b);
		border: none;
	}`;
	css_add_style(mod_style_field_input);
	css_add_style(mod_style_field_input_placeholder);


	// Пометка для поля
	const mod_style_field_label = `.mod_field_label{
		color: var(--input_label, black);
		font-size: 16px;
		line-height: 19px;
		margin-top: 6px;
		padding-bottom: 5px;
		width: max-content;
		gap: 4px;
	}`;
	css_add_style(mod_style_field_label);

	// Кнопка
	const mod_style_button = `.mod_button{
		height: 60px;
		width: 220px;
		border: none;
		border-radius: 24px;
		box-sizing: border-box;
		line-height: 33px;
		justify-content: center;
		align-items: center;
	}`;
	css_add_style(mod_style_button);

	// Кнопка поиска
	const mod_style_button_search = `.mod_button_search{
		height: 68px;
		width: 70px;
		border-radius: 0 24px 24px 0;
	}`;
	css_add_style(mod_style_button_search);
	// --------------
	// КАСТОМНОЕ МЕНЮ
	// --------------
	// "Провалиться в заявку" - переходим в заявку по введенному номеру заявки
	const mod_menu_blank_jump_to = `
		<li class="mod_main">
			<div class="mod_main mod_div mod_field mod_field_search" id="mod_menu_field_search_blank">
				<label class="mod_main mod_field_label">Провалиться в заявку</label>
				<input type="text" class="mod_field_input" id="mod_menu_field_search_blank_input" placeholder="00000000">
			</div>
			<button class="mod_main mod_selected mod_button mod_button_search" id="mod_menu_button_search_blank" title="Провалиться (+РЦ+ЮЛ+ТТ)" href="#">
				<img src="/assets/images/loop.svg" alt=">>">
			</div>
		</li>`;

	// event listener для кнопки "провалиться в заявку"
	function __mod_event_blank_jump_to(event){
		event.preventDefault();
		// Берем blank_id из введенной в поле "Провалиться в заявку"
		const __input_blank_id = mod_el_to_num(html_find_id('mod_menu_field_search_blank_input').value);
		if (__input_blank_id){
			mod_blank_jump(__input_blank_id);
		} else{
			alert('[POSCREDIT MOD]\nНе указал номер заявки, в которую хочешь провалиться\nНе стыдно?');
		}
	}

	// MAIN: Кастомное меню
	// Находим шапку, к которой будем добавлять новую менюшку, и добавляем новую менюшку к ней
	const bank_header = html_find_class('header');
	if (bank_header){
		bank_header.insertAdjacentHTML('afterend', `
			<div class="header_wrapper">
				<ul id="mod_menu">
					${mod_menu_blank_jump_to}
				</ul>
			</div>`);
		html_find_id('mod_menu_button_search_blank').addEventListener('click', __mod_event_blank_jump_to)
		console.log("Кастомное меню загружено");
	}

	// -----
	// БАНКИ
	// -----
	const mod_all_banks = document.getElementsByClassName('banks_block_name');
	if (mod_all_banks){
		// Добавляем ID банков
		for (let i = 0; i < mod_all_banks.length; i++){
			mod_all_banks[i].querySelector('span').innerHTML += ` <sup style="color: #b8b8b8"><b>[<bank ID>]</b></sup>`
		};
	};

	// Надоедливые прогрузки
	//const window_cloud = document.getElementById('window_cloud');
	//if (window_cloud){
	//	window_cloud.style.cssText += 'position: fixed; bottom: 20px; right: 20px';
};


// --------
// cp.b2pos
// --------
if (mod_current_site == 'cp.b2pos.ru'){
	// --------------
	// КАСТОМНОЕ МЕНЮ
	// --------------

	// Админ панель
	// https://cp.b2pos.ru/adminpanel/
	if (mod_current_url_elements[1] == 'adminpanel'){
		// Плашка о загрузке мода
		console.log('Мод загружен')
		const mod_cp_admin_loaded = `
		<div class="approve-message" style="opacity: 0;">
			<div class="approve-message__icon"></div>
			<div class="approve-message__text">Мод загружен</div>
		</div>`;
		const cp_interactive_search = html_find_class('interactive-search');
		if (cp_interactive_search){
			cp_interactive_search.insertAdjacentHTML('afterend', mod_cp_admin_loaded);
		};

		// Убираем мусор
	};

	// SQL консоль
	// https://cp.b2pos.ru/v1/web/dev/sql-console/
	if (mod_current_url == 'https://cp.b2pos.ru/v1/web/dev/sql-console/'){

	};

	// https://cp.b2pos.ru/company/edit/*
	if (mod_current_url_elements[1] == 'company' && mod_current_url_elements[2] == 'edit'){
		// Включить загрузку фото с ПК для ЮЛ
		const mod_cp_add_photo_uploading_from_pc = `
		<div style="background-color: #b7d9c1;" id="mod_cp_menu_photo_from_pc" title="Быстро включить загрузку фото с ПК для ЮЛ и сохранить настройки">
			Загрузка фото с ПК
		</div>`;

		// Мод меню
		const mod_cp_menu = `
		<div class="tabs" id="mod_cp_menu">
			<h3 style="color: #4b7e99;" id="mod_cp_menu_header">Моды</h3>
			${mod_cp_add_photo_uploading_from_pc}
		</div>`;
		// Добавляем новое меню к старому
		const cp_header_company_edit = html_find_class('tabs');
		if (cp_header_company_edit){
			cp_header_company_edit.insertAdjacentHTML('afterend', mod_cp_menu);
		};

		// Загрузка фото с ПК (в редактировании ЮЛ)
		function mod_cp_photo_from_pc(){
			html_find('[data-id="services_settings"]').click(); // Нажимает "Настройки услуг", чтобы не вылезало окна о "недостающих данных"
			html_find('input[name="is_allowPcPhoto"]').checked = true; // Нажимает на флажок загрузки фото с ПК
			window.confirm = () => true; // Убирает "Вы проверили все данные, заполнили «Условия сотрудничества» и хотите сохранить?"
			html_find_id('companyAdd').click(); // Нажимает "сохранить"
		};

		// Добавить функцию для кнопки загрузки фото с ПК
		html_find_id('mod_cp_menu_photo_from_pc').addEventListener('click', mod_cp_photo_from_pc);
	};
};

// --------------------------
// JIRA
// https://jira.b2serv.local
// --------------------------
if (mod_current_site == 'https://jira.b2serv.local/'){
	// Задачи
	if (mod_current_url_elements[1] == 'browse' && mod_current_url_elements[2]){
		// КАСТОМНАЯ МЕНЮШКА
		html_find_class('command-bar');
	};
};
