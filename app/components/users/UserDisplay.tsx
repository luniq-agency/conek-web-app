import { User } from '@/app/types/Database';
import Column from '../layout/Column';
import Row from '../layout/Row';
import { UserAvatar } from '../UserAvatar';

interface Props {
  label: string;
  user: User | undefined;
}

export default function UserDisplay({ label, user }: Props) {
  const userName = `${user?.user_name_first} ${user?.user_name_last}`;

  if (!user)
    return (
      <Column gap={4}>
        <label>{label}</label>
        <Row alignItems="center" gap={8}>
          <div style={{backgroundColor:'#ebebeb',borderRadius:200,height:32,width:32}}/>
          <span>–</span>
        </Row>
      </Column>
    );

  return (
    <Column gap={4}>
      <label>{label}</label>
      <Row alignItems="center" gap={8}>
        <UserAvatar fontSize={14} height={30} user={user} width={30} />
        <span>{userName}</span>
      </Row>
    </Column>
  );
}
