import { useState } from 'react';

interface InstallGuideProps {
  onClose: () => void;
}

export default function InstallGuide({ onClose }: InstallGuideProps) {
  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📲 Установка на устройство
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {isAndroid ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Установите игру на главный экран Android через браузер Chrome:
            </p>
            <ol className="space-y-3 text-sm text-gray-200">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">1</span>
                <span>Откройте эту страницу в <strong className="text-white">Google Chrome</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>Нажмите на <strong className="text-white">⋮</strong> (три точки) в правом верхнем углу</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">3</span>
                <span>Выберите <strong className="text-white">«Добавить на главный экран»</strong> или <strong className="text-white">«Установить приложение»</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">4</span>
                <span>Подтвердите нажатием <strong className="text-white">«Установить»</strong></span>
              </li>
            </ol>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mt-4">
              <p className="text-xs text-green-300">
                💡 После установки игра будет работать <strong>офлайн</strong> и открываться как обычное приложение с главного экрана.
              </p>
            </div>
          </div>
        ) : isIOS ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Установите игру на главный экран iPhone/iPad через Safari:
            </p>
            <ol className="space-y-3 text-sm text-gray-200">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">1</span>
                <span>Откройте эту страницу в <strong className="text-white">Safari</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>Нажмите кнопку <strong className="text-white">«Поделиться»</strong> (квадрат со стрелкой вверх) внизу экрана</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">3</span>
                <span>Прокрутите вниз и выберите <strong className="text-white">«На экран Домой»</strong></span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">4</span>
                <span>Нажмите <strong className="text-white">«Добавить»</strong></span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Установите игру как приложение на компьютер:
            </p>
            <ol className="space-y-3 text-sm text-gray-200">
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">1</span>
                <span>В адресной строке Chrome нажмите на <strong className="text-white">значок установки</strong> (⊕) справа</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">2</span>
                <span>Или откройте меню <strong className="text-white">⋮ → «Установить страницу как приложение»</strong></span>
              </li>
            </ol>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/25"
        >
          Понятно!
        </button>
      </div>
    </div>
  );
}
