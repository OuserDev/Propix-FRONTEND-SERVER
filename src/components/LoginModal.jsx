import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose, activeTab, setActiveTab }) => {
    const { login, register, setUserInfo, showToast } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '', // 추가
        nickname: '', // 추가
        realtorName: '', // 추가
        rememberMe: false,
        agreeTerms: false, // 추가
    });

    // 카카오 로그인 버튼 핸들러
    const handleKakaoLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (activeTab === 'login') {
                const success = await login(formData.email, formData.password);
                if (success) {
                    setFormData({
                        // 폼 초기화 추가
                        email: '',
                        password: '',
                        confirmPassword: '',
                        name: '',
                        phone: '',
                        nickname: '',
                        realtorName: '',
                        rememberMe: false,
                        agreeTerms: false,
                    });
                    onClose();
                }
            } else {
                // 회원가입 유효성 검사 추가
                if (!formData.email || !formData.password || !formData.name || !formData.phone || !formData.nickname) {
                    showToast('모든 필수 항목을 입력해주세요.', 'error');
                    return;
                }

                if (formData.password !== formData.confirmPassword) {
                    showToast('비밀번호가 일치하지 않습니다.', 'error');
                    return;
                }

                if (!formData.agreeTerms) {
                    showToast('이용약관에 동의해주세요.', 'error');
                    return;
                }

                const registerData = {
                    member_email: formData.email,
                    member_password: formData.password,
                    member_name: formData.name,
                    member_phone: formData.phone,
                    member_nickname: formData.nickname,
                    member_realtor_name: formData.realtorName,
                };

                const success = await register(registerData);
                if (success) {
                    setFormData({
                        // 폼 초기화 추가
                        email: '',
                        password: '',
                        confirmPassword: '',
                        name: '',
                        phone: '',
                        nickname: '',
                        realtorName: '',
                        rememberMe: false,
                        agreeTerms: false,
                    });
                    onClose();
                }
            }
        } catch (error) {
            showToast(error.message || '오류가 발생했습니다.', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // 기존 JSX 부분에서 카카오 버튼 부분만 수정
    const SocialButtons = () => (
        <div className="space-y-3">
            <button onClick={handleKakaoLogin} type="button" className="w-full py-3 px-4 bg-[#FEE500] text-[#000000] rounded-lg hover:bg-[#FDD835] transition-colors flex items-center justify-center space-x-2">
                <img src="/kakao_logo.svg" alt="Kakao" className="w-5 h-5" />
                <span>{activeTab === 'login' ? '카카오로 시작하기' : '카카오로 회원가입'}</span>
            </button>
            <button
                className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                disabled // Google 로그인은 아직 미구현
            >
                <img src="/google_logo.svg" alt="Google" className="w-5 h-5" />
                <span>Google로 시작하기</span>
            </button>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="bg-white rounded-lg p-8 max-w-md w-full m-4 z-50" onClick={(e) => e.stopPropagation()}>
                        {/* 탭 버튼 */}
                        <div className="flex justify-between mb-6">
                            <div className="flex space-x-4">
                                <button className={`font-semibold ${activeTab === 'login' ? 'text-[#75E593]' : 'text-gray-400'}`} onClick={() => setActiveTab('login')}>
                                    로그인
                                </button>
                                <button className={`font-semibold ${activeTab === 'register' ? 'text-[#75E593]' : 'text-gray-400'}`} onClick={() => setActiveTab('register')}>
                                    회원가입
                                </button>
                            </div>
                            <button onClick={onClose}>
                                <span className="text-gray-400 text-xl">&times;</span>
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'login' ? (
                                    <div className="space-y-4">
                                        <SocialButtons />

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">또는</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* 기존 로그인 폼 유지 */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]" placeholder="이메일을 입력하세요." required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]"
                                                    placeholder="비밀번호를 입력하세요."
                                                    required
                                                />
                                            </div>
                                            {/* 로그인 부가 기능 */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input type="checkbox" id="rememberMe" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="h-4 w-4 text-[#75E593] focus:ring-[#75E593] border-gray-300 rounded" />
                                                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                                        로그인 상태 유지
                                                    </label>
                                                </div>
                                                <button type="button" className="text-sm text-[#75E593] hover:text-[#68cc84]">
                                                    비밀번호 찾기
                                                </button>
                                            </div>
                                            <button type="submit" className="w-full py-2 bg-[#75E593] text-white rounded-lg hover:bg-[#68cc84] transition-colors">
                                                로그인
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <SocialButtons />

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">또는</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* 확장된 회원가입 폼 */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]" placeholder="이메일을 입력하세요." required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]"
                                                    placeholder="비밀번호를 입력하세요."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]"
                                                    placeholder="비밀번호를 다시 입력하세요."
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]" placeholder="이름을 입력하세요." required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]" placeholder="전화번호를 입력하세요." required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                                                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]" placeholder="닉네임을 입력하세요." required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">부동산 이름</label>
                                                <input type="text" name="realtorName" value={formData.realtorName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#75E593]" placeholder="부동산 이름을 입력하세요." />
                                            </div>

                                            <div className="flex items-center">
                                                <input type="checkbox" id="agree-terms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-[#75E593] focus:ring-[#75E593] border-gray-300 rounded" required />
                                                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                                                    이용약관 및 개인정보처리방침에 동의합니다.
                                                </label>
                                            </div>
                                            <button type="submit" className="w-full py-2 bg-[#75E593] text-white rounded-lg hover:bg-[#68cc84] transition-colors">
                                                회원가입
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
