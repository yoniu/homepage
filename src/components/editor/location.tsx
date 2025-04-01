"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import { App, Button, Dropdown, GetProps, Input } from 'antd';
import api from "@/src/utils/api";
import axios from "axios";
import { MessageInstance } from "antd/es/message/interface";
import { useEffect, useMemo, useState } from "react";

type SearchProps = GetProps<typeof Input.Search>;

export interface IBMapLocationResponse {  
  address: string,
  content: {  
    address: string,
    address_detail: {  
      city: string,
      city_code: number,
      province: string,    
    },  
    point: {  
      x: string,
      y: string
    }  
  },  
  status: number
}

export interface IBMapSuggestionResponse {
  name: string,
  location: {
    lat: number,
    lng: number,
  },
  uid: string,
  province: string,
  city: string,
  district: string,
  business: string,
  cityid: string,
  tag: string,
  address: string,
  children: [],
  adcode: string
}

const { Search } = Input;

export default function EditorLocation() {

  const { state, dispatch } = useEditorStateContext();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<IBMapSuggestionResponse[]>([]);
  const [suggestionVisible, setSuggestionVisible] = useState(false);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    switch (key) {
      case 'latitude':
        setLatitude(e.target.value);
        break;
      case 'longitude':
        setLongitude(e.target.value);
        break;
      case 'province':
        setProvince(e.target.value);
        break;
      case 'city':
        setCity(e.target.value);
        break;
      case 'address':
        setAddress(e.target.value);
        break;
    }
  }

  const updateGlobalState = () => {
    const prevAttributes = state.attributes ?? null;
    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...prevAttributes,
          location: {
            latitude,
            longitude,
            province,
            city,
            address,
          },
        }
      }
    })
  }

  const handleGetLocation = () => {
    setLoading(true)
    getLocation(message).then(res => {
      if (!res) return;
      setLatitude(res.content.point.y)
      setLongitude(res.content.point.x)
      setProvince(res.content.address_detail.province)
      setCity(res.content.address_detail.city)
    }).finally(() => {
      setLoading(false)
    })
  }

  const dropdownItems = useMemo(() => {
    return [...suggestions.map(item => ({
      key: item.uid,
      label: item.name,
      onClick: () => {
        setAddress(item.name)
        setLatitude(item.location.lat.toString())
        setLongitude(item.location.lng.toString())
        setProvince(item.province)
        setCity(item.city)
        setSuggestionVisible(false)
      }
    })), {
      key: 'close',
      label: '关闭',
      onClick: () => {
        setSuggestionVisible(false)
      }
    }]
  }, [suggestions])

  const onSearch: SearchProps['onSearch'] = (value) => {
    setSearchLoading(true)
    getSuggestion(message, value, city).then(res => {
      if (!res) return;
      setSuggestions(res)
      setSuggestionVisible(true)
    }).finally(() => {
      setSearchLoading(false)
    })
  }

  useEffect(() => {
    if (state.attributes?.location) {
      setLatitude(state.attributes.location.latitude || '')
      setLongitude(state.attributes.location.longitude || '')
      setProvince(state.attributes.location.province || '')
      setCity(state.attributes.location.city || '')
      setAddress(state.attributes.location.address || '')
    }
  }, [state.attributes])

  useEffect(() => {
    updateGlobalState();
  }, [latitude, longitude, province, city, address])
  
  return (
    <SidebarCollapse title="定位服务" className="space-y-1" defaultOpen={false}>
      <div className="flex items-center space-x-2">
        <Input value={latitude} onChange={(e) => handleChange('latitude', e)} placeholder="经度" />
        <Input value={longitude} onChange={(e) => handleChange('longitude', e)} placeholder="纬度" />
      </div>
      <div className="flex items-center space-x-2">
        <Input value={province} onChange={(e) => handleChange('province', e)} placeholder="省份" />
        <Input value={city} onChange={(e) => handleChange('city', e)} placeholder="城市" />
      </div>
      <Button type="default" size="small" onClick={handleGetLocation} loading={loading}>定位</Button>
      <div className="flex items-center space-x-2">
        <Dropdown menu={{ items: dropdownItems }} open={suggestionVisible}>
          <Search loading={searchLoading} value={address} onChange={(e) => handleChange('address', e)} onSearch={onSearch} placeholder="根据城市搜索地址" />
        </Dropdown>
      </div>
    </SidebarCollapse>
  )
}

async function getLocation(message: MessageInstance) {
  try {
    const ip = await axios.get('https://httpbin.org/ip')
      .then(res => res.data.origin);
    const res = await api.get<IBMapLocationResponse>(`/location/ip/${ip}`);
    return res.data;
  } catch (error) {
    message.error(`获取位置失败：${error}`);
  }
}

async function getSuggestion(message: MessageInstance, keyword: string, city: string) {
  try {
    const res = await api.get<IBMapSuggestionResponse[]>(`/location/suggestion/`, {
      keyword,
      city,
    });
    return res.data;
  } catch (error) {
    message.error(`获取位置失败：${error}`);
  }
}