"use client";

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { App } from 'antd';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import useIcon from '@/src/hooks/icon';
import { normalizeApiError } from '@/src/shared/api/error';

import { useAuth } from '../hooks/useAuth';

export default function MenuLoginButton() {
  const { message: messageApi } = App.useApp();
  const { login, syncLoginState } = useAuth();

  useEffect(() => {
    syncLoginState();
  }, [syncLoginState]);

  const IconFont = useIcon();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setLoading(true);
    login({ name: username, password })
      .then((user) => {
        messageApi.success(`欢迎回来，${user.name}`);
        setVisible(false);
      })
      .catch((error) => {
        normalizeApiError(messageApi, error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <button
        className="flex items-center hover:bg-gray-300 text-lg rounded px-3 py-2 -mx-3 space-x-2 transition-all"
        onClick={() => setVisible(true)}
      >
        <IconFont className="text-lg" type="icon-yonghu" />
        <span className="text-xs lg:text-base">Login</span>
      </button>
      {ReactDOM.createPortal(
        <div
          className={cn(
            'fixed top-0 left-0 size-full flex flex-col items-center justify-center z-50',
            visible ? 'flex' : 'hidden'
          )}
        >
          <div
            className="absolute top-0 left-0 size-full bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setVisible(false)}
          ></div>
          <div className="bg-white pt-6 pb-4 px-4 rounded-lg shadow-sm z-10 min-w-80">
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>
            </form>
            <div className="flex items-center justify-between mt-3">
              <Button variant="outline" onClick={() => setVisible(false)}>
                Cancel
              </Button>
              <Button onClick={handleLogin} disabled={loading}>
                Login
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
