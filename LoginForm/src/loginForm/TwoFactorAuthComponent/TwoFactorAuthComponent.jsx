import React, { useRef, useState, useEffect, forwardRef } from 'react';
import Input from '../../defComponents/input/input';
import Button from '../../defComponents/button/button';
import './TwoFactorAuthComponent.css';
import { verifyCodeApi } from '../../api/authApi.js';

const InputWithRef = forwardRef(({ className, ...props }, ref) => (
  <Input ref={ref} className={className} {...props} />
));

function TwoFactorAuthComponent({ userId, onSuccess }) {
  const [code, setCode] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

 const handleChange = (e, idx) => {
  const val = e.target.value.replace(/\D/g, '').slice(0, 1);

  setCode((prev) => {
    const arr = [...prev];
    arr[idx] = val;

    if (val && idx < 5) {
      setTimeout(() => {
        inputsRef.current[idx + 1]?.focus();
      }, 0);
    }

    if (!val && e.nativeEvent.inputType === 'deleteContentBackward' && idx > 0) {
      setTimeout(() => {
        inputsRef.current[idx - 1]?.focus();
      }, 0);
    }

    return arr;
  });
};



const handleKeyDownInput = (e, idx) => {
  if (e.key === 'Enter') {
    handleSubmit();
  } else {
    handleKeyDown(e, idx); // ваша навигация по стрелкам
  }
};


  const handleSubmit = async () => {
    if (code.some(c => c === '')) {
      setError('Please enter a valid 6-digit code.');
      setIsCorrect(false);
      return;
    }
    setLoading(true);
    setError('');
    const enteredCode = code.join('');
    try {
      const res = await verifyCodeApi({ userId, code: enteredCode });
      if (res.success) {
        setIsCorrect(true);
        setError('');
        onSuccess && onSuccess();
      }
    } catch (err) {
      setIsCorrect(false);
      setError(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(30);
    setCode(Array(6).fill(''));
    setError('');
    setIsCorrect(null);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="two-factor-auth-form">
      <div className="company-title">
        <span className="company-logo" />
        Company
      </div>
      <h3>Two-Factor Authentication</h3>
      <div className="subtitle">Enter the 6-digit code from the Google Authenticator app</div>
      <div className="code-input-row">
        {code.map((v, idx) => (
          <InputWithRef
             key={idx}
            ref={el => inputsRef.current[idx] = el}
            type="text"
            value={v}
            placeholder=""
            className={`code-input ${isCorrect === null ? '' : isCorrect ? 'correct' : 'incorrect'}`}
            onChange={e => handleChange(e, idx)}
            onKeyDown={e => handleKeyDownInput(e, idx)}
            disabled={loading || isCorrect === true}
            onKeyPress={e => {
                if (!/[\d]/.test(e.key)) e.preventDefault();
            }}
          />
        ))}
      </div>
      {error && <div className="error-message-auth">{error}</div>}

      {isCorrect === true ? (
        <div className="success-message">Valid code</div>
      ) : (
        <>
          {code.every(c => c !== '') && !loading && (
            <Button className="button" onClick={handleSubmit} disabled={loading}>
              Подтвердить
            </Button>
          )}

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
