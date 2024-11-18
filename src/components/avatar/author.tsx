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
    <div className="flex items-center space-x-2 leading-4 mb-2 py-1 pl-1 pr-2 bg-gray-50 rounded-md">
      <img className="w-6 rounded " src={`https://www.gravatar.com/avatar/${hash}?s=100`} alt={name} />
      <div className="flex-1 text-sm font-bold text-gray-600">{name}</div>
      <div className="justify-self-end text-xs text-gray-500">{other}</div>
    </div>
  )
}
