import React, { useRef, useState, useEffect, forwardRef } from 'react';
import Input from '../../defComponents/input/input';
import Button from '../../defComponents/button/button';
import './TwoFactorAuthComponent.css';
import { verifyCodeApi } from '../../api/authApi.js';

// Обертка для передачи ref в кастомный Input компонент
const InputWithRef = forwardRef(({ className, ...props }, ref) => (
  <Input ref={ref} className={className} {...props} />
));

function TwoFactorAuthComponent({ userId, onSuccess }) {
  // Храним состояние кода 6 цифр
  const [code, setCode] = useState(Array(6).fill(''));
  // Статус ошибки
  const [error, setError] = useState('');
  // Статус загрузки при отправке
  const [loading, setLoading] = useState(false);
  // Проверка правильности кода: null - еще не проверен, true/false - статус
  const [isCorrect, setIsCorrect] = useState(null);
  // Таймер для повторной отправки
  const [timeLeft, setTimeLeft] = useState(30);
  // Ref для хранения ссылок на инпуты
  const inputsRef = useRef([]);

  // Таймер для отсчета времени на resend
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Обработчик изменения ввода
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1); // Разрешать только цифры

    setCode((prev) => {
      const arr = [...prev];
      arr[idx] = val;

      // Автоматический фокус при вводе
      if (val && idx < 5) {
        setTimeout(() => {
          inputsRef.current[idx + 1]?.focus();
        }, 0);
      }

      // Возврат фокуса назад при удалении
      if (!val && e.nativeEvent.inputType === 'deleteContentBackward' && idx > 0) {
        setTimeout(() => {
          inputsRef.current[idx - 1]?.focus();
        }, 0);
      }

      return arr;
    });
  };

  // Обработчик нажатия клавиш
  const handleKeyDownInput = (e, idx) => {
    if (e.key === 'Enter') {
      handleSubmit(); // подтверждение по Enter
    } else {
      handleKeyDown(e, idx); // навигация по стрелкам (функция не предоставлена, предполагается реализована)
    }
  };

  // Функция отправки кода
  const handleSubmit = async () => {
    // Проверяем, все ли цифры введены
    if (code.some(c => c === '')) {
      setError('Please enter a valid 6-digit code.');
      setIsCorrect(false);
      return;
    }
    setLoading(true);
    setError('');
    const enteredCode = code.join('');
    try {
      const res = await verifyCodeApi({ userId, code: enteredCode }); // API вызов
      if (res.success) {
        setIsCorrect(true);
        setError('');
        onSuccess && onSuccess(); // при успехе вызываем коллбэк
      }
    } catch (err) {
      setIsCorrect(false);
      setError(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  // Обработка повторной отправки кода
  const handleResendCode = () => {
    setTimeLeft(30);
    setCode(Array(6).fill(''));
    setError('');
    setIsCorrect(null);
    inputsRef.current[0]?.focus();
  };

  // JSX разметка компонента (без комментариев в нем)
  return (
    <div className="two-factor-auth-form">
      {/* Название компании и логотип */}
      <div className="company-title">
        <span className="company-logo" />
        Company
      </div>
      {/* Заголовок */}
      <h3>Two-Factor Authentication</h3>
      {/* Подпись */}
      <div className="subtitle">Enter the 6-digit code from the Google Authenticator app</div>
      {/* Блок для ввода кода */}
      <div className="code-input-row">
        {code.map((v, idx) => (
          <InputWithRef
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)} // сохраняем ссылку на input
            type="text"
            value={v}
            placeholder=""
            className={`code-input ${isCorrect === null ? '' : isCorrect ? 'correct' : 'incorrect'}`}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDownInput(e, idx)}
            disabled={loading || isCorrect === true}
            onKeyPress={(e) => {
              if (!/[\d]/.test(e.key)) e.preventDefault(); // разрешить только цифры
            }}
          />
        ))}
      </div>
      {/* Вывод ошибок */}
      {error && <div className="error-message-auth">{error}</div>}

      {/* Успешное сообщение */}
      {isCorrect === true ? (
        <div className="success-message">Valid code</div>
      ) : (
        <>
          {/* Кнопка подтвердить, активна при полном вводе и не в процессе загрузки */}
          {code.every((el) => el !== '') && !loading && (
            <Button className="button" onClick={handleSubmit} disabled={loading}>
              Подтвердить
            </Button>
          )}

          {/* Таймер и кнопка повторной отправки */}
          {(isCorrect === false || timeLeft <= 30) && (
            timeLeft > 0 ? (
              <div className="resend-timer">Отправить новый код можно через {timeLeft} сек</div>
            ) : (
              <Button className="resend-button" onClick={handleResendCode}>
                Отправить новый код
              </Button>
            )
          )}
        </>
      )}

      <Button className="hidden-submit" onClick={handleSubmit} aria-hidden="true" />
    </div>
  );
}

export default TwoFactorAuthComponent;
