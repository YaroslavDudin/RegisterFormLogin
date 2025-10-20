import { useState } from 'react';
import Input from '../defComponents/input/input.jsx';
import Button from '../defComponents/button/button.jsx';
import TwoFactorAuthComponent from './TwoFactorAuthComponent/TwoFactorAuthComponent.jsx';
import './style.css';

function LoginForm() {
    const [selectedOption, setSelectedOption] = useState('Почта');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [isTwoFactor, setIsTwoFactor] = useState(false);


    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Поле не может быть пустым';
        } else if (selectedOption === 'Почта' && !/\S+@\S+\.\S\S+/.test(email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!name && showRegisterForm) {
            newErrors.name = 'Поле не может быть пустым';
        }

        if (!password) {
            newErrors.password = 'Поле не может быть пустым';
        } else if (password.length < 8) {
            newErrors.password = 'Пароль должен быть не менее 8 символов';
        }

        if (showRegisterForm && (!passwordRepeat || passwordRepeat !== password)) {
            newErrors.passwordRepeat = 'Пароль должен совпадать';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (!validateForm()) return;

        setIsTwoFactor(true);
    };

    if (isTwoFactor) {
    return <TwoFactorAuthComponent />;
  }

    const renderLoginForm = () => (
        <div className="login-form">
            <h2>Вход</h2>
            <Input
                label={selectedOption}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder={selectedOption}
                required
            />
            <Input
                label="Пароль"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Пароль"
                required
            />
            {errors.form && <div className="error-message">{errors.form}</div>}
            <Button onClick={handleLogin} disabled={loading} className="button">ВОЙТИ</Button>
            <a href="#" onClick={() => setShowRegisterForm(true)}>Зарегистрироваться</a>
        </div>
    );

    const renderRegisterForm = () => (
        <div className="login-form">
            <h2>Регистрация</h2>
            <Input
                onChange={(e) => setName(e.target.value)}
                label='ФИО'
                type='text'
                value={name}
                error={errors.name}
                placeholder='Фамилия Имя Отчество'
                required
            />
            <Input
                onChange={(e) => setEmail(e.target.value)}
                label="Почта"
                value={email}
                error={errors.email}
                placeholder="Почта"
                required
            />
            <Input
                label="Пароль"
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Пароль"
                required
            />
            <Input
                label="Подтверждение пароля"
                type={isPasswordVisible ? 'text' : 'password'}
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
                placeholder="Подтверждение пароля"
                error={errors.passwordRepeat}
                required
            />
            <Button onClick={handleLogin} disabled={loading} className="button">РЕГИСТРАЦИЯ</Button>
            <p className='dont-have-account'>Уже есть аккаунт?</p>
            <a href="#" onClick={() => setShowRegisterForm(false)}>Войти</a>
        </div>
    );

    return (
        <div>
            {showRegisterForm ? renderRegisterForm() : renderLoginForm()}
        </div>
    );
}

export default LoginForm;
