import { IMusicItem } from "@/src/components/editor/music";
import markdownit from 'markdown-it';
import { Col, Image, Row } from "antd";
import AuthorAvatar from "@/src/components/avatar/author";
import dayFormat from "@/src/utils/dayFormat";
import { TTextBackgroundColor } from "@/src/components/editor/backgroundColor";
import { useMemo } from "react";

export interface ITextItem {
  music?: IMusicItem
  photosets?: IPhotosetItem[]
  backgroundColor?: TTextBackgroundColor
}

interface IProps {
  item: IMomentItem<ITextItem>
}

export default function TextItem({ item }: IProps) {

  const md = markdownit()
  
  const backgroundColor = useMemo<TTextBackgroundColor | undefined>(() => {
    if (item.attributes?.backgroundColor) {
      return item.attributes.backgroundColor
    }
  }, [item.attributes])

  const textColor = useMemo(() => {
    return backgroundColor?.textColor ?? '#333'
  }, [backgroundColor])

  const Background = () => {
    switch (backgroundColor?.type) {
      case 'solid':
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 z-0" style={{ backgroundColor: backgroundColor.color }}></div>
      case 'gradient':
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 z-0" style={{ background: `linear-gradient(to bottom, ${backgroundColor.colors?.join(',')})` }}></div>
      case 'image':
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 z-0 opacity-80 scale-110 blur-[5spx]" style={{ backgroundImage: `url(${backgroundColor.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      default:
        return <div className="absolute bottom-0 left-0 w-full h-full inset-0 bg-gradient-to-t from-black/5 to-transparent z-0"></div>
    }
  }

  const Photosets = () => {
    if (item.attributes && item.attributes.photosets) {
      return (
        <Image.PreviewGroup>
          <Row className="mx-0 mt-2" gutter={[6, 6]}>
            {
              item.attributes.photosets?.map((photo) => (
                <Col key={photo.id} span={8}>
                  <Image
                    wrapperClassName="relative aspect-square w-full overflow-hidden rounded"
                    className="absolute w-full !h-full object-cover"
                    src={photo.url}
                    alt={photo.name}
                  />
                </Col>
              ))
            }
          </Row>
        </Image.PreviewGroup>
      )
    }
    return (
      <></>
    )
  }

  return (
    <div className="flex flex-col overflow-hidden w-full h-full">
      <div className="relative w-full h-full flex-1 bg-white overflow-hidden">
        <Background />
        <div className="absolute top-14 left-0 w-full bottom-0 p-3 sm:p-5 overflow-y-auto overflow-x-hidden scrollbar-hide" style={{ color: textColor }}>
          <div className="max-w-2xl mx-auto">
            { item.title && <h3 className="sm:text-3xl text-2xl font-bold mb-2">{item.title}</h3> }
            <AuthorAvatar {...item.author} other={dayFormat(item.create_time)} />
            { item.content && <div className="text-xl sm:text-2xl [&>p]:leading-relaxed" dangerouslySetInnerHTML={{ __html: md.render(item.content) }} /> }
            <Photosets />
          </div>
        </div>
      </div>
    </div>
  )
}
