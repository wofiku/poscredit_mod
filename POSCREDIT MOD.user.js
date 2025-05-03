// ==UserScript==
// @name         POSCREDIT MOD
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Мод для POSCREDIT
// @author       wofiku
// @match        https://*.b2pos.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=b2pos.ru
// @grant        window.onurlchange
// ==/UserScript==

(function() {
    'use strict';

	// -------
	// ФУНКЦИИ
	// -------
	// Переменную в число
	function el_to_num(variable){
		return variable.replaceAll(/\D/g, "") | 0 // Выводим только цифры, или, если их нет, - выводим 0, чтобы не получить пустое значение
	};

	// URL в имя домена или IP-адрес
	function url_name(url){
		return url.replace('https://', '').replace('http://', '').split('/')[0] // Убираем "http(s)://", разделяем по "/", выбираем только доменное имя/IP-адрес
	};

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

	// Добавить класс к элементу
	function html_add_class(el, class_to_add){
		el.classList.add(class_to_add)
	};

	// CSS: добавить стиль
	function css_add_style(style_str){
		mod_css.insertRule(style_str, mod_css.cssRules.length);
	}

	// ----------
	// ПЕРЕМЕННЫЕ
	// ----------
	// На каком сайте сейчас
	const mod_current_url = document.location.href;
	const mod_current_site = url_name(mod_current_url);
	const mod_css = document.styleSheets[0];

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


	// --------------------
	// ОБЩИЕ МОДЫ POSCREDIT
	// --------------------
	// TODO
	// Убрать logout
	// cp: фото с пк
	// bank: несмешная менюшка для вызова ВСЕХ МЕТОДОВ АААААААААААААА


	// Перепрыгнуть в заявку
	function mod_blank_jump(blank_id){
		window.location.href = `/search/profile${blank_id}/`;
	};
	// УБРАТЬ ЛОГАУТ
	//const logout_window = document.querySelector('.logoutWindow');
	//if (logout_window){
	//	logout_window.remove()
	//}



	// ----------
	// bank.b2pos
	// ----------
	if (mod_current_site == 'bank.b2pos.ru'){
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
			const __input_blank_id = html_find_id('mod_menu_field_search_blank_input').value.replaceAll(/\D/g, "");
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
		const all_banks = html_find_class('banks_block__title');
		if (all_banks){
			console.log(all_banks)
		}

		// Надоедливые прогрузки
		//const window_cloud = document.getElementById('window_cloud');
		//if (window_cloud){
		//	window_cloud.style.cssText += 'position: fixed; bottom: 20px; right: 20px';
	}


})();