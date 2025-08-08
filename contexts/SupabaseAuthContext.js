import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../supabase.config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(null);

  console.log('🚀 Supabase AuthContext 初始化...');

  // 檢查 Supabase 連接
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        setIsSupabaseAvailable(isConnected);
        console.log('🔍 Supabase 可用性:', isConnected);
        
        // 強制重新檢查，確保狀態正確
        if (isConnected) {
          console.log('✅ Supabase 確認可用，註冊功能已啟用');
        } else {
          console.log('❌ Supabase 不可用，將使用模擬模式');
        }
      } catch (error) {
        console.log('❌ Supabase 初始化失敗:', error);
        setIsSupabaseAvailable(false);
      }
    };

    // 只在首次加載時檢查
    if (isSupabaseAvailable === null) {
      initSupabase();
    }
  }, [isSupabaseAvailable]);

  // 監聽認證狀態變化
  useEffect(() => {
    console.log('🔄 設置 Supabase 認證監聽器...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 認證狀態變化:', event, session?.user?.email);
        
        if (session?.user) {
          console.log('🔍 嘗試獲取用戶資料...');
          try {
            // 獲取用戶資料
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.log('⚠️ 獲取用戶資料失敗 (可能是 RLS 問題):', error.message);
              console.log('🔄 使用基本用戶信息');
            }

            if (profile && !error) {
              console.log('✅ 獲取用戶資料成功');
              setCurrentUser({
                uid: session.user.id,
                email: session.user.email,
                ...profile
              });
            } else {
              console.log('🔄 使用基本用戶信息 (沒有 profile 或查詢失敗)');
              setCurrentUser({
                uid: session.user.id,
                email: session.user.email,
                nickname: session.user.email?.split('@')[0] || '用戶',
                age: 25,
                gender: 'male'
              });
            }
          } catch (error) {
            console.error('❌ 獲取用戶資料時發生錯誤:', error);
            console.log('🔄 使用基本用戶信息');
            setCurrentUser({
              uid: session.user.id,
              email: session.user.email,
              nickname: session.user.email?.split('@')[0] || '用戶',
              age: 25,
              gender: 'male'
            });
          }
        } else {
          console.log('🚪 用戶已登出，清理狀態');
          setCurrentUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 清理 Supabase 認證監聽器');
      subscription.unsubscribe();
    };
  }, []);

  // 手動重新檢查 Supabase 連接
  async function recheckSupabaseConnection() {
    try {
      const isConnected = await checkSupabaseConnection();
      setIsSupabaseAvailable(isConnected);
      console.log('🔄 重新檢查 Supabase 可用性:', isConnected);
      return isConnected;
    } catch (error) {
      console.log('❌ 重新檢查失敗:', error);
      setIsSupabaseAvailable(false);
      return false;
    }
  }

  // 註冊功能
  async function signup(email, password, additionalInfo = {}) {
    console.log('📝 開始 Supabase 註冊...', { email, additionalInfo });
    setError(null);

    // 如果狀態不確定，重新檢查連接
    if (isSupabaseAvailable === null || isSupabaseAvailable === false) {
      console.log('🔄 註冊前重新檢查 Supabase 連接...');
      const isConnected = await recheckSupabaseConnection();
      
      if (!isConnected) {
        console.log('⚠️ Supabase 不可用，使用模擬模式');
        console.log('🔍 當前 isSupabaseAvailable 狀態:', isSupabaseAvailable);
        return mockSignup(email, password, additionalInfo);
      }
    }
    
    console.log('✅ Supabase 可用，開始真實註冊...');

    try {
      // 1. 創建認證用戶
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('❌ Supabase 認證註冊失敗:', authError);
        throw authError;
      }

      console.log('✅ Supabase 認證用戶創建成功:', authData.user?.id);

      // 2. 創建用戶資料
      if (authData.user) {
        // 等待一小段時間確保認證上下文建立
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 檢查當前會話
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('🔍 當前會話狀態:', sessionData.session ? '已登入' : '未登入');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            nickname: additionalInfo.nickname || '匿名用戶',
            age: additionalInfo.age || 25,
            gender: additionalInfo.gender || 'male'
          });

        if (profileError) {
          console.error('❌ 用戶資料創建失敗:', profileError);
          console.log('🔍 錯誤詳情:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details
          });
          // 認證用戶已創建，但資料插入失敗，不拋出錯誤
        } else {
          console.log('✅ 用戶資料創建成功');
        }

        // 手動設置當前用戶狀態
        if (authData.user) {
          const newUser = {
            uid: authData.user.id,
            email: authData.user.email,
            nickname: additionalInfo.nickname || '匿名用戶',
            age: additionalInfo.age || 25,
            gender: additionalInfo.gender || 'male'
          };
          console.log('🔄 手動設置當前用戶:', newUser);
          setCurrentUser(newUser);
        }
      }

      return authData;
    } catch (error) {
      console.error('❌ 註冊失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 登入功能
  async function login(email, password) {
    console.log('🔑 開始 Supabase 登入...', { email });
    setError(null);

    // 確保之前的狀態已清理
    setCurrentUser(null);

    if (!isSupabaseAvailable) {
      console.log('⚠️ Supabase 不可用，使用模擬模式');
      return mockLogin(email, password);
    }

    try {
      console.log('🔑 直接嘗試 Supabase 登入（跳過連接檢查）...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Supabase 登入失敗:', error);
        console.log('🔍 錯誤詳情:', {
          code: error.message,
          status: error.status,
          email: email
        });
        throw error;
      }

      if (!data.user) {
        console.error('❌ 登入成功但未獲得用戶數據');
        throw new Error('登入異常，請稍後再試');
      }

      console.log('✅ Supabase 登入成功:', data.user?.email);
      return data;
    } catch (error) {
      console.error('❌ 登入失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 登出功能
  async function logout() {
    console.log('👋 開始登出...');
    setError(null);

    // 立即清理本地狀態
    setCurrentUser(null);

    if (!isSupabaseAvailable) {
      console.log('⚠️ Supabase 不可用，使用模擬登出');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ 登出失敗:', error);
        // 即使登出失敗，也要清理本地狀態
        console.log('🧹 強制清理本地狀態');
      } else {
        console.log('✅ Supabase 登出成功');
      }
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      console.log('🧹 強制清理本地狀態');
      // 不要拋出錯誤，避免影響用戶體驗
    }
    
    // 確保狀態被清理
    console.log('🧹 確保用戶狀態已清理');
  }

  // 分享煩惱
  async function shareTrouble(troubleContent) {
    console.log('📝 分享煩惱...', { troubleContent });
    console.log('📝 當前用戶信息:', {
      isSupabaseAvailable,
      currentUser: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null
    });
    setError(null);

    if (!isSupabaseAvailable || !currentUser) {
      console.log('⚠️ Supabase 不可用或未登入，使用模擬模式');
      return mockShareTrouble(troubleContent);
    }

    try {
      console.log('📝 清理用戶的舊煩惱和配對記錄...');
      
      // 1. 先清理用戶的舊配對記錄
      const { error: matchCleanError } = await supabase
        .from('matches')
        .delete()
        .eq('matcher_id', currentUser.uid);
        
      if (matchCleanError) {
        console.log('⚠️ 清理配對記錄失敗:', matchCleanError.message);
      } else {
        console.log('✅ 已清理舊配對記錄');
      }
      
      // 2. 清理用戶的舊煩惱記錄
      const { error: troubleCleanError } = await supabase
        .from('troubles')
        .delete()
        .eq('user_id', currentUser.uid);
        
      if (troubleCleanError) {
        console.log('⚠️ 清理煩惱記錄失敗:', troubleCleanError.message);
      } else {
        console.log('✅ 已清理舊煩惱記錄');
      }

      // 3. 創建新的煩惱記錄
      const insertData = {
        user_id: currentUser.uid,
        content: troubleContent,
        status: 'active'
      };
      console.log('📝 準備插入的數據:', insertData);

      const { data, error } = await supabase
        .from('troubles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ 分享煩惱失敗:', error);
        console.error('❌ 錯誤詳情:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ 煩惱分享成功:', data.id);
      console.log('✅ 返回的數據:', data);
      return data;
    } catch (error) {
      console.error('❌ 分享煩惱失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 獲取用戶煩惱歷史
  async function getUserTroubles() {
    console.log('📋 獲取用戶煩惱歷史...');
    setError(null);

    if (!isSupabaseAvailable || !currentUser) {
      console.log('⚠️ Supabase 不可用或未登入，使用模擬模式');
      return mockGetUserTroubles();
    }

    try {
      const { data: troubles, error } = await supabase
        .from('troubles')
        .select('*')
        .eq('user_id', currentUser.uid)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 獲取煩惱歷史失敗:', error);
        throw error;
      }

      console.log('✅ 獲取煩惱歷史成功:', troubles?.length || 0, '條記錄');
      return troubles || [];
    } catch (error) {
      console.error('❌ 獲取煩惱歷史失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 尋找配對
  async function findMatch() {
    console.log('🔍 尋找配對...');
    console.log('🔍 調試信息:', {
      isSupabaseAvailable,
      currentUser: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null
    });
    setError(null);

    // 強制測試 Supabase 查詢，即使檢查失敗也要嘗試
    console.log('🧪 強制測試 Supabase 查詢...');
    
    if (!currentUser) {
      console.log('❌ 沒有當前用戶，無法繼續');
      return mockFindMatch();
    }

    try {
      // 直接測試 troubles 表查詢
      console.log('🧪 測試查詢 troubles 表...');
      const { data: testTroubles, error: testError } = await supabase
        .from('troubles')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('❌ troubles 表查詢失敗:', testError);
        console.error('錯誤詳情:', {
          message: testError.message,
          code: testError.code,
          details: testError.details,
          hint: testError.hint
        });
        return mockFindMatch();
      }
      
      console.log('✅ troubles 表查詢成功，找到', testTroubles?.length || 0, '條記錄');
      
      // 如果原來的檢查失敗但實際查詢成功，繼續正常流程
      if (!isSupabaseAvailable) {
        console.log('⚠️ isSupabaseAvailable 為 false，但查詢成功，繼續執行...');
      }
    } catch (error) {
      console.error('❌ 強制測試查詢失敗:', error);
      return mockFindMatch();
    }

    if (!isSupabaseAvailable || !currentUser) {
      console.log('⚠️ Supabase 不可用或未登入，使用模擬模式');
      console.log('⚠️ 原因:', { 
        isSupabaseAvailable: isSupabaseAvailable,
        hasCurrentUser: !!currentUser 
      });
      return mockFindMatch();
    }

    try {
      // 1. 檢查是否已經有當日配對
      const today = new Date().toISOString().split('T')[0];
      const { data: existingMatches, error: existingError } = await supabase
        .from('matches')
        .select('*')
        .eq('matcher_id', currentUser.uid)
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');

      if (existingError) {
        console.error('❌ 檢查現有配對失敗:', existingError);
        throw existingError;
      }

      if (existingMatches && existingMatches.length > 0) {
        console.log('ℹ️ 今日已有配對，獲取現有配對信息');
        return await getMyCurrentMatch();
      }

      // 2. 智能配對邏輯：尋找合適的煩惱
      console.log('🔍 查詢可配對的煩惱...');
      console.log('🔍 當前用戶 ID:', currentUser.uid);
      
      // 先測試基本查詢
      console.log('🧪 測試基本 troubles 查詢...');
      const { data: allTroubles, error: allTroublesError } = await supabase
        .from('troubles')
        .select('*');
      
      if (allTroublesError) {
        console.error('❌ 基本 troubles 查詢失敗:', allTroublesError);
      } else {
        console.log('✅ 基本查詢成功，總共', allTroubles?.length || 0, '個煩惱');
        console.log('📋 所有煩惱:', allTroubles?.map(t => ({
          id: t.id,
          user_id: t.user_id,
          status: t.status,
          content: t.content?.substring(0, 50) + '...'
        })));
      }
      
      // 現在執行完整查詢
      const { data: troubles, error: troublesError } = await supabase
        .from('troubles')
        .select(`
          *,
          profiles:user_id (nickname, age, gender)
        `)
        .eq('status', 'active')
        .neq('user_id', currentUser.uid)
        .order('created_at', { ascending: true }); // 優先處理較早的煩惱

      if (troublesError) {
        console.error('❌ 查找煩惱失敗:', troublesError);
        console.error('錯誤詳情:', {
          message: troublesError.message,
          code: troublesError.code,
          details: troublesError.details,
          hint: troublesError.hint
        });
        throw troublesError;
      }

      console.log('🔍 查詢結果:', troubles?.length || 0, '個可配對的煩惱');
      if (!troubles || troubles.length === 0) {
        console.log('😔 暫時沒有可配對的煩惱');
        return null;
      }

      // 3. 過濾已經配對過的煩惱
      const availableTroubles = [];
      for (const trouble of troubles) {
        const { data: existingMatch } = await supabase
          .from('matches')
          .select('id')
          .eq('trouble_id', trouble.id)
          .eq('matcher_id', currentUser.uid);

        if (!existingMatch || existingMatch.length === 0) {
          availableTroubles.push(trouble);
        }
      }

      if (availableTroubles.length === 0) {
        console.log('😔 沒有新的可配對煩惱');
        return null;
      }

      // 4. 智能選擇配對（這裡可以加入更複雜的算法）
      const selectedTrouble = selectBestMatch(availableTroubles, currentUser);
      console.log('✅ 智能選擇配對:', selectedTrouble.id);

      // 5. 創建配對記錄
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert({
          trouble_id: selectedTrouble.id,
          matcher_id: currentUser.uid,
          status: 'active'
        })
        .select()
        .single();

      if (matchError) {
        console.error('❌ 創建配對失敗:', matchError);
        console.error('配對錯誤詳情:', {
          message: matchError.message,
          code: matchError.code,
          details: matchError.details,
          hint: matchError.hint
        });
        throw matchError;
      }

      console.log('🎉 配對創建成功:', match.id);
      return {
        matchId: match.id,
        trouble: selectedTrouble.content,
        user: selectedTrouble.profiles
      };
    } catch (error) {
      console.error('❌ 尋找配對失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 智能配對選擇算法
  function selectBestMatch(availableTroubles, currentUser) {
    // 簡單的配對邏輯，可以根據需要擴展
    // 1. 優先選擇時間較早的煩惱（先來先服務）
    // 2. 可以考慮年齡差異、性別等因素
    
    console.log('🤖 執行智能配對算法，可選煩惱數量:', availableTroubles.length);
    
    // 目前使用簡單的時間優先策略
    const sortedTroubles = availableTroubles.sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );
    
    return sortedTroubles[0];
  }

  // 上傳音頻文件到 Supabase Storage
  async function uploadAudio(audioUri, fileName = null) {
    console.log('📤 上傳音頻文件...', { audioUri });
    setError(null);

    if (!isSupabaseAvailable || !currentUser) {
      console.log('⚠️ Supabase 不可用或未登入，使用模擬模式');
      return mockUploadAudio(audioUri);
    }

    try {
      // 生成唯一文件名
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const finalFileName = fileName || `blessing_${currentUser.uid}_${timestamp}_${randomId}.m4a`;

      // 讀取音頻文件
      const response = await fetch(audioUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      // 上傳到 Supabase Storage
      const { data, error } = await supabase.storage
        .from('audio-files')
        .upload(finalFileName, arrayBuffer, {
          contentType: 'audio/mp4',
          upsert: false
        });

      if (error) {
        console.error('❌ 音頻上傳失敗:', error);
        throw error;
      }

      console.log('✅ 音頻上傳成功:', data.path);

      // 獲取公開 URL
      const { data: urlData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(data.path);

      return {
        path: data.path,
        url: urlData.publicUrl,
        fileName: finalFileName
      };
    } catch (error) {
      console.error('❌ 上傳音頻失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 保存祝福記錄
  async function saveBlessingRecord(matchId, audioUrl, textContent = null) {
    console.log('💾 保存祝福記錄...', { matchId, audioUrl });
    setError(null);

    if (!isSupabaseAvailable || !currentUser) {
      console.log('⚠️ Supabase 不可用或未登入，使用模擬模式');
      return mockSaveBlessingRecord(matchId, audioUrl);
    }

    try {
      // 獲取配對信息以確定接收者
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select(`
          *,
          troubles:trouble_id (user_id)
        `)
        .eq('id', matchId)
        .single();

      if (matchError) {
        console.error('❌ 獲取配對信息失敗:', matchError);
        throw matchError;
      }

      // 保存祝福記錄
      const { data, error } = await supabase
        .from('blessings')
        .insert({
          match_id: matchId,
          from_user_id: currentUser.uid,
          to_user_id: match.troubles.user_id,
          audio_url: audioUrl,
          text_content: textContent
        })
        .select()
        .single();

      if (error) {
        console.error('❌ 保存祝福記錄失敗:', error);
        throw error;
      }

      console.log('✅ 祝福記錄保存成功:', data.id);
      return data;
    } catch (error) {
      console.error('❌ 保存祝福記錄失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 獲取當前配對
  async function getMyCurrentMatch() {
    console.log('📋 獲取當前配對...');
    console.log('📋 調試信息:', {
      isSupabaseAvailable,
      currentUser: currentUser ? { uid: currentUser.uid, email: currentUser.email } : null
    });
    setError(null);

    // 強制測試 Supabase 查詢，即使檢查失敗也要嘗試
    console.log('🧪 強制測試獲取配對...');
    
    if (!currentUser) {
      console.log('❌ 沒有當前用戶，無法獲取配對');
      return null; // 返回 null 而不是模擬數據
    }

    try {
      // 直接測試 matches 表查詢
      console.log('🧪 測試查詢 matches 表...');
      const { data: testMatches, error: testError } = await supabase
        .from('matches')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('❌ matches 表查詢失敗:', testError);
        console.error('❌ 錯誤詳情:', {
          message: testError.message,
          code: testError.code,
          details: testError.details,
          hint: testError.hint
        });
        return null; // 返回 null 而不是模擬數據
      }
      
      console.log('✅ matches 表查詢成功，找到', testMatches?.length || 0, '條記錄');
      
      // 如果測試成功，繼續正常查詢
      console.log('🔍 開始查詢用戶的實際配對...');
    } catch (error) {
      console.error('❌ 強制測試配對查詢失敗:', error);
      return null; // 返回 null 而不是模擬數據
    }

    try {
      console.log('🔍 查詢用戶的活躍配對...');
      
      // 直接查詢活躍配對，不做額外的調試查詢
      const { data: matches, error } = await supabase
        .from('matches')
        .select(`
          *,
          troubles:trouble_id (
            content,
            profiles:user_id (nickname, age, gender)
          )
        `)
        .eq('matcher_id', currentUser.uid)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ 獲取配對失敗:', error);
        return null;
      }

      if (!matches || matches.length === 0) {
        console.log('📭 暫時沒有活躍配對');
        return null;
      }

      const match = matches[0];
      console.log('✅ 獲取配對成功:', match.id);

      return {
        matchId: match.id,
        trouble: match.troubles?.content || '無法載入煩惱內容',
        user: match.troubles?.profiles || { nickname: '匿名用戶' }
      };
    } catch (error) {
      console.error('❌ 獲取配對失敗:', error);
      setError(error.message);
      throw error;
    }
  }

  // 模擬功能（當 Supabase 不可用時）
  const mockUsers = [
    { email: 'test@example.com', password: '123456', nickname: '測試用戶', age: 25, gender: 'male' }
  ];

  function mockSignup(email, password, additionalInfo) {
    console.log('🎭 模擬註冊:', { email, additionalInfo });
    const newUser = {
      uid: Date.now().toString(),
      email,
      nickname: additionalInfo.nickname || '模擬用戶',
      age: additionalInfo.age || 25,
      gender: additionalInfo.gender || 'male'
    };
    setCurrentUser(newUser);
    return Promise.resolve({ user: newUser });
  }

  function mockLogin(email, password) {
    console.log('🎭 模擬登入:', { email });
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const mockUser = { uid: Date.now().toString(), ...user };
      setCurrentUser(mockUser);
      return Promise.resolve({ user: mockUser });
    }
    throw new Error('模擬登入失敗：用戶名或密碼錯誤');
  }

  function mockShareTrouble(content) {
    console.log('🎭 模擬分享煩惱:', { content });
    return Promise.resolve({
      id: Date.now().toString(),
      content,
      status: 'active'
    });
  }

  function mockGetUserTroubles() {
    console.log('🎭 模擬獲取煩惱歷史');
    return Promise.resolve([
      {
        id: 'mock-1',
        content: '工作壓力很大，不知道如何平衡',
        status: 'active',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 昨天
      },
      {
        id: 'mock-2', 
        content: '最近睡眠質量不好，總是失眠',
        status: 'active',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 前天
      },
      {
        id: 'mock-3',
        content: '和朋友關係有些緊張，不知道如何修復',
        status: 'matched',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
      }
    ]);
  }

  function mockFindMatch() {
    console.log('🎭 模擬尋找配對');
    // 模擬多種配對情況
    const mockTroubles = [
      {
        matchId: Date.now().toString(),
        trouble: '最近工作壓力很大，老闆一直催進度，同事關係也有點緊張。每天下班都覺得很疲憊，想要有人能聽聽我的困擾。',
        user: { nickname: '需要支持的朋友', age: 28, gender: 'female' }
      },
      {
        matchId: Date.now().toString(),
        trouble: '剛搬到新城市，還沒有朋友，感覺很孤單。雖然工作還不錯，但下班後不知道該做什麼，很想有人聊天。',
        user: { nickname: '新城市居民', age: 25, gender: 'male' }
      },
      {
        matchId: Date.now().toString(),
        trouble: '家裡寵物生病了，醫藥費很貴，但又捨不得放棄治療。感覺很無助，希望有人能給我一些建議和鼓勵。',
        user: { nickname: '愛貓人士', age: 32, gender: 'female' }
      }
    ];
    
    // 隨機選擇一個配對
    const randomMatch = mockTroubles[Math.floor(Math.random() * mockTroubles.length)];
    console.log('🎭 模擬配對內容:', randomMatch.trouble.substring(0, 30) + '...');
    
    return Promise.resolve(randomMatch);
  }

  function mockGetCurrentMatch() {
    console.log('🎭 模擬獲取當前配對');
    return Promise.resolve({
      matchId: Date.now().toString(),
      trouble: '我感到很孤單，希望有人能理解我...',
      user: { nickname: '需要關懷的朋友', age: 24, gender: 'male' }
    });
  }

  function mockUploadAudio(audioUri) {
    console.log('🎭 模擬音頻上傳:', { audioUri });
    return Promise.resolve({
      path: `mock/audio/blessing_${Date.now()}.m4a`,
      url: audioUri, // 在模擬模式下直接返回本地 URI
      fileName: `mock_blessing_${Date.now()}.m4a`
    });
  }

  function mockSaveBlessingRecord(matchId, audioUrl) {
    console.log('🎭 模擬保存祝福記錄:', { matchId, audioUrl });
    return Promise.resolve({
      id: Date.now().toString(),
      match_id: matchId,
      from_user_id: 'mock_user_id',
      to_user_id: 'mock_target_user_id',
      audio_url: audioUrl,
      created_at: new Date().toISOString()
    });
  }

  const value = {
    currentUser,
    signup,
    login,
    logout,
    shareTrouble,
    getUserTroubles,
    findMatch,
    getMyCurrentMatch,
    uploadAudio,
    saveBlessingRecord,
    error,
    isSupabaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}