import CryptoJS from 'crypto-js';
import { useMemo } from 'react';

interface IProps {
  email: string;
  name: string;
  other: string;
}

export default function AuthorAvatar({ email, name, other }: IProps) {

  const hash = useMemo(() => CryptoJS.MD5(email).toString(), [email])

  return (
    <div className="flex items-center space-x-2 leading-4 mb-3">
      <img className="w-6 rounded" src={`https://weavatar.com/avatar/${hash}?s=100`} alt={name} />
      <div className="flex-1 text-sm font-bold">{name}</div>
      <div className="justify-self-end text-xs opacity-80">{other}</div>
    </div>
  )
}
