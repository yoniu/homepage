"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import { App, Button, Dropdown, GetProps, Input } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getClientIp, getLocationByIp, searchLocation, type BMapSuggestionResponse } from "@/src/features/editor/api";
import { normalizeApiError } from "@/src/shared/api/error";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

export default function EditorLocation() {

  const { state, dispatch } = useEditorStateContext();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<BMapSuggestionResponse[]>([]);
  const [suggestionVisible, setSuggestionVisible] = useState(false);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const attributesRef = useRef(state.attributes);

  useEffect(() => {
    attributesRef.current = state.attributes;
  }, [state.attributes]);

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

  const updateGlobalState = useCallback(() => {
    const prevAttributes = attributesRef.current ?? null;
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
  }, [address, city, dispatch, latitude, longitude, province])

  const handleGetLocation = () => {
    setLoading(true)

    getClientIp()
      .then((ip) => getLocationByIp(ip))
      .then((response) => {
        setLatitude(response.data.content.point.y)
        setLongitude(response.data.content.point.x)
        setProvince(response.data.content.address_detail.province)
        setCity(response.data.content.address_detail.city)
      })
      .catch((error) => {
        normalizeApiError(message, error)
      })
      .finally(() => {
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

    searchLocation(value, city)
      .then((response) => {
        setSuggestions(response.data)
        setSuggestionVisible(true)
      })
      .catch((error) => {
        normalizeApiError(message, error)
      })
      .finally(() => {
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
  }, [updateGlobalState])
  
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
