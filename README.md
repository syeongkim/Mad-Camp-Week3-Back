CitHub은…😻 

🗣
CitHub는 개발자들을 위한  아바타 기반의 관계망 확장, 셀프 기록 서비스입니다.

- GitHub API를 이용해 나의 커밋 기록을 불러오고 이를 기반으로 다양한 이벤트가 일어납니다.
개발 환경
FrontEnd: React
BackEnd: Nest.js 
DB: MongoDB
Cloud: Kcloud
팀원
💻 기능
1️⃣ 깃허브 소셜 로그인
사용자의 기존 깃허브 계정으로 로그인할 수 있습니다.
그동안의 커밋 기록이 반영됩니다.
2️⃣ 나의 방 꾸미기

GitHub api로 불러온 내 커밋 잔디를 보여줍니다. 각각의 오브젝트는 버튼으로 동작합니다.
- 커밋 기록이 있는 날은 해가 떠있습니다.
아이템 구매
상점에서 개발자의 삶의 질 향상을 위한 여러 아이템들(노트북, 블루라이트 차단 안경, 헤드셋 등)을 코인을 이용하여 구매할 수 있습니다.

프로필 - 상태메시지 설정
프로필에서 작성한 상태메시지는 파티룸에서 모두에게 보여집니다.

TIL (Today I Learned) 작성
개발자는 평생 배워야하는 직업.. 매일매일 새롭게 배운 것들을 작성해봅시다!
TIL을 하나 작성할 때 마다 코인 3개를 얻을 수 있습니다.
쪽지 보내기
친해지고 싶은 개발자가 있다면 슬쩍 쪽지를 보내보세요~
CitHub가 비밀스럽고 안전하게(?) 전달해드립니다.


3️⃣ Party
금주의 커밋왕, 금주의 소통왕, 금주의 열정왕

지난주에 가장 많은 커밋을 달성한 사용자, 지난주에 가장 많은 쪽지를 보낸 사용자, 지난주에 연속 3일 이상 TIL을 작성한 사용자들을 확인할 수 있습니다.
다른 사용자에게 쪽지 보내기
매일매일 컴퓨터랑만 대화하는건 지겨워.. 파티장에서는 서비스를 이용하는 모든 사용자들을 만날 수 있습니다! 다른 사용자들의 오늘 하루 메세지를 확인하고, 친해지고 싶은 개발자들에게 쪽지를 보내보아요~
미니게임
개발을 너무 열심히 해서 머리가 지끈지끈할 때, 잠깐 휴식을 취해보아요! 30초 동안 열심히 클로바를 주워 코인으로 교환하세요 오늘도 러키비키한 하루! 🍀​
🌀 DataBases
@Schema()
export class User extends Document {
  @ApiProperty({ description: '사용자의 github ID', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '사용자의 github 프로필 사진', example: 'https://avatars.githubusercontent.com/u/107764281?v=4' })
  @Prop()
  profile: string;

  @ApiProperty({ description: '사용자의 github access_token', example: 'abcd' })
  @Prop()
  access_token: string;
}
​
@Schema()
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  stocks: number;

  @Prop({ required: true, default: false })
  current: boolean;
}

@Schema()
export class UserItem extends Document {
  @ApiProperty({ description: '사용자의 github ID', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '사용자가 소유하고 있는 item들의 이름, 재고, 현재 착용 여부', example: '[{"name": "coffee","stocks": 1,"current": true},{"name": "hoodie","stocks": 1,"current": true},{"name": "shirt","stocks": 2,"current": false}]' })
  @Prop({ type: [ItemSchema], default: [] })
  items: Item[];
}
​
@Schema()
export class Til extends Document {
  @ApiProperty({ description: 'Contents of TIL', example: '오늘은 react와 node 버전을 맞췄다.' })
  @Prop({ required: true })
  contents: string;

  @ApiProperty({ description: 'Images related to TIL', example: [] })
  @Prop({ type: [String], default: [] })
  images: string[];
}

@Schema()
export class UserTil extends Document {
  @ApiProperty({ description: 'Username', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ type: [Til], description: 'List of TILs' })
  @Prop({ type: [TilSchema], default: [] })
  til: Til[];
}
​
@Schema()
export class Record extends Document {
  @ApiProperty({ description: '사용자의 github ID', example: 'syeongkim' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: '코인 개수', example: 0 })
  @Prop({ required: true, default: 0 })
  coin: number;

  @ApiProperty({ description: '오늘 커밋 여부', example: false })
  @Prop({ default: false })
  hasCommit: boolean;

  @ApiProperty({ description: '이번 달 커밋 횟수', example: 24 })
  @Prop({ default: 0 })
  commitCount: number;

  @ApiProperty({ description: '현재 착용하고 있는 아이템들', example: ["coffee", "hoodie"] })
  @Prop({ type: [String], default: [] })
  wearing_items: string[];

  @ApiProperty({ description: '한마디', example: 'no message' })
  @Prop({ default: "no message" })
  message: string;
}
​
@Schema()
export class Post extends Document {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  contents: string;
}
​
🌐 APIs 
🪂 사용된 외부 API / 라이브러리 
1️⃣ GitHub OAuth API
2️⃣ GitHub Commit API
