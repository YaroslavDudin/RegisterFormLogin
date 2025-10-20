import { useState } from 'react';
import Input from '../defComponents/input/input.jsx';
import Button from '../defComponents/button/button.jsx';
import TwoFactorAuthComponent from './TwoFactorAuthComponent/TwoFactorAuthComponent.jsx';
import { BiHide, BiShow } from "react-icons/bi";
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

    // чтобы не было ошибки при вводе пароля (глазик)
    const renderField = ({ label, value, onChange, type = 'text', placeholder, name }) => {
        const isPasswordField = type === 'password' || (type === 'text' && label && label.toLowerCase().includes('пароль'));
        const inputType = isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type;

        return (
            <div className="input-container" key={name || placeholder}>
                {label && <label>{label}</label>}
                <div className="input-wrapper">
                    <Input
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className=""
                        required={true}
                    />
                    {isPasswordField && (
                        <span
                            className="toggle-icon"
                            onClick={() => setPasswordVisibility(prev => !prev)}
                            style={{ cursor: 'pointer' }}
                        >
                            {isPasswordVisible ? <BiHide /> : <BiShow />}
                        </span>
                    )}
                </div>
                {name && errors[name] && <span className="error-message">{errors[name]}</span>}
                {!name && placeholder && errors[placeholder] && <span className="error-message">{errors[placeholder]}</span>}
            </div>
        );
    };

    const renderLoginForm = () => (
        <div className="login-form">
            <h2>Вход</h2>

            {renderField({
                label: selectedOption,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                type: 'text',
                placeholder: selectedOption,
                name: 'email'
            })}

            {renderField({
                label: 'Пароль',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                type: 'password',
                placeholder: 'Пароль',
                name: 'password'
            })}

            {errors.form && <div className="error-message">{errors.form}</div>}

            <Button onClick={handleLogin} disabled={loading} className="button">ВОЙТИ</Button>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowRegisterForm(true); }}>Зарегистрироваться</a>
        </div>
    );

    const renderRegisterForm = () => (
        <div className="login-form">
            <h2>Регистрация</h2>

            {renderField({
                label: 'ФИО',
                value: name,
                onChange: (e) => setName(e.target.value),
                type: 'text',
                placeholder: 'Фамилия Имя Отчество',
                name: 'name'
            })}

            {renderField({
                label: 'Почта',
                value: email,
                onChange: (e) => setEmail(e.target.value),
                type: 'text',
                placeholder: 'Почта',
                name: 'email'
            })}

            {renderField({
                label: 'Пароль',
                value: password,
                onChange: (e) => setPassword(e.target.value),
                type: 'password',
                placeholder: 'Пароль',
                name: 'password'
            })}

            {renderField({
                label: 'Подтверждение пароля',
                value: passwordRepeat,
                onChange: (e) => setPasswordRepeat(e.target.value),
                type: 'password',
                placeholder: 'Подтверждение пароля',
                name: 'passwordRepeat'
            })}

            <Button onClick={handleLogin} disabled={loading} className="button">РЕГИСТРАЦИЯ</Button>
            <p className='dont-have-account'>Уже есть аккаунт?</p>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowRegisterForm(false); }}>Войти</a>
        </div>
    );

    return (
        <div>
            {showRegisterForm ? renderRegisterForm() : renderLoginForm()}
        </div>
    );
}

export default LoginForm;
