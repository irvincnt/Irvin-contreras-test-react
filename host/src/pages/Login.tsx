import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  ValidationErrors,
  PasswordValidations,
  ValidationItemProps,
} from '../interfaces';

function ValidationItem({ isValid, text }: ValidationItemProps): React.ReactElement {
  return (
    <div className="flex items-center text-xs">
      {isValid ? (
        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      <span className={isValid ? 'text-green-700' : 'text-red-700'}>{text}</span>
    </div>
  );
}

function Login(): React.ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordValidations, setPasswordValidations] = useState<PasswordValidations>({
    minLength: false,
    maxLength: true,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    hasNumber: false,
  });

  const login = useAuthStore((state) => state.login);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pwd: string): boolean => {
    const validations: PasswordValidations = {
      minLength: pwd.length >= 6,
      maxLength: pwd.length <= 12,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      hasNumber: /\d/.test(pwd),
    };
    setPasswordValidations(validations);
    return Object.values(validations).every((v: boolean) => v === true);
  };

  const handlePreventCopyPaste = (e: React.ClipboardEvent): false => {
    e.preventDefault();
    return false;
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setErrors((prev: ValidationErrors) => ({ ...prev, email: 'El formato del correo debe ser correo@dominio.com' }));
    } else {
      setErrors((prev: ValidationErrors) => {
        const newErrors: ValidationErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setPassword(value);
    validatePassword(value);
    
    if (confirmPassword && value !== confirmPassword) {
      setErrors((prev: ValidationErrors) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
    } else if (confirmPassword) {
      setErrors((prev: ValidationErrors) => {
        const newErrors: ValidationErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setConfirmPassword(value);
    
    if (value !== password) {
      setErrors((prev: ValidationErrors) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
    } else {
      setErrors((prev: ValidationErrors) => {
        const newErrors: ValidationErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const newErrors: ValidationErrors = {};
    
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'El formato del correo debe ser correo@dominio.com';
    }
    
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(password)) {
      newErrors.password = 'La contraseña no cumple con todos los requisitos';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debe confirmar la contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (email !== 'irvin@gmail.com' || password !== 'testReact25@') {
      setErrors({ general: 'Usuario o contraseña incorrectos' });
      return;
    }
    
    login({ email });
    navigate('/rick-morty', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Bienvenido</h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onCopy={handlePreventCopyPaste}
              onPaste={handlePreventCopyPaste}
              onCut={handlePreventCopyPaste}
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
              placeholder="correo@dominio.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              onCopy={handlePreventCopyPaste}
              onPaste={handlePreventCopyPaste}
              onCut={handlePreventCopyPaste}
              className={`w-full px-4 py-3 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
              placeholder="Ingresa tu contraseña"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            
            {password && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-semibold text-gray-700 mb-2">La contraseña debe cumplir:</p>
                <ValidationItem 
                  isValid={passwordValidations.minLength} 
                  text="Mínimo 6 caracteres" 
                />
                <ValidationItem 
                  isValid={passwordValidations.maxLength} 
                  text="Máximo 12 caracteres" 
                />
                <ValidationItem 
                  isValid={passwordValidations.hasUpperCase} 
                  text="Al menos una letra mayúscula" 
                />
                <ValidationItem 
                  isValid={passwordValidations.hasLowerCase} 
                  text="Al menos una letra minúscula" 
                />
                <ValidationItem 
                  isValid={passwordValidations.hasSpecialChar} 
                  text="Al menos un carácter especial (!@#$%^&*...)" 
                />
                <ValidationItem 
                  isValid={passwordValidations.hasNumber} 
                  text="Al menos un número" 
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onCopy={handlePreventCopyPaste}
              onPaste={handlePreventCopyPaste}
              onCut={handlePreventCopyPaste}
              className={`w-full px-4 py-3 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
              placeholder="Confirma tu contraseña"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
            {confirmPassword && !errors.confirmPassword && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Las contraseñas coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-gray-500">
            * No se permite copiar ni pegar en los campos del formulario
          </p>
          <p className="text-sm text-gray-600">
            Credenciales de prueba:<br />
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">irvin@gmail.com / testReact25@</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

