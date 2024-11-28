import { IMusicItem } from "@/src/components/editor/music";
import MomentControl from "@/src/components/moments/control";
import markdownit from 'markdown-it';
import { Col, Image, Row } from "antd";
import MusicPlayer from "@/src/components/play/music";
import AuthorAvatar from "@/src/components/avatar/author";
import dayFormat from "@/src/utils/dayFormat";

export interface ITextItem {
  music?: IMusicItem
  photosets?: IPhotosetItem[]
}

interface IProps {
  item: IMomentItem<ITextItem>
}

export default function TextItem({ item }: IProps) {

  const md = markdownit()

  const Music = () => {
    if (item && item.attributes && item.attributes.music) {
      return <MusicPlayer {...item.attributes.music} />
    } else {
      return <></>
    }
  }

  const Photosets = () => {
    if (item.attributes && item.attributes.photosets) {
      return (
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
      )
    }
    return (
      <></>
    )
  }

  return (
    <div className="flex flex-col rounded-md overflow-hidden w-full h-full">
      <Music />
      <div className="relative w-full h-full flex-1 bg-white">
        <div className="absolute top-0 left-0 w-full h-full p-3 overflow-y-auto overflow-x-hidden">
          { item.title && <h3 className="text-xl font-bold mb-2">{item.title}</h3> }
          <AuthorAvatar {...item.author} other={dayFormat(item.create_time)} />
          { item.content && <div dangerouslySetInnerHTML={{ __html: md.render(item.content) }} /> }
          <Photosets />
        </div>
        <MomentControl />
      </div>
    </div>
  )
}
