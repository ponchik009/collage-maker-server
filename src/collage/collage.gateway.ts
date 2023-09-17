import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { CollageService } from './collage.service';

const names = [
  'google_was_my_idea',
  'Bleedclay',
  'i_boop_ur_nose',
  'casanova',
  'DreamHaunter',
  'TheZodiac',
  'Chiclet',
  'Dark Humorer',
  'stinky_pinky',
  'Whackingit',
  'Amanda Hugginkiss',
  'take_your_pants_off',
  'Mafia Don',
  'MortalMonkey',
  'Gold Digger',
  'ToySoldier',
  'Vald Bagina',
  'whos_ur_buddha',
  'Malice In',
  'pig_benis',
  'BegForMercy',
  'judgeofwings',
  'name_not_important',
  'DexterzProtege',
  'Cyber Helmet',
  'ask_yo_girl_about_me',
  'tin_foil_hat',
  'bill_nye_the_russian_spy',
  'Scoop Me Up',
  'im_watching_you',
  'itchy_and_scratchy',
  'Vald Bagina',
  'Heywood Japulmah Finga',
  'Kaal Bhairav',
  'SumDumFuk',
  'mother_of_dragons',
  'Vanilla',
  'Call Me Cool',
  'Phil Down',
  'Ollie Tabooger',
  'Follow For Follow',
  'Eaton Beaver',
  'oprah_wind_fury',
  'real_name_hidden',
  'lolikillyou',
  'Cool Dude 69',
  'MondayGUNS',
  'imma_rage_quit',
  'musty_elbow',
  'i_can_see_your_pixels',
  'theFacelessOne',
  'crispy_lips',
  'PinkPristineArtillery',
  'Teri Pyaar ka Kamina',
  'TheSilentBang',
  'hairy_poppins',
  'butt_smasher',
  'Gambit Queen',
  'Anita Hardcok',
  'Walking Drgon',
  'Cyber Helmet',
  'cowgirl_up',
  'Captain Cooker',
  'InfernalHeir',
  'protect_ya_neck',
  'tea_baggins',
  'CapnBloodBeard',
  'DarkShadow',
  'unfriend_now',
  'The White Tiger',
  'Wooden Man',
  '12Nuns',
  'Shawnfan',
  'herpes_free_since_03',
  'Lipin Jection',
  'cannibalqueen',
  'GunnerBomb',
  'aldente',
  'XBoxShutDown',
  'PurpleBunnySlippers',
  'CerealKillah',
  'Mein Tera Hero',
  'One in a Minion',
  'do_not_leave_me',
  'Phil Accio',
  'Cuteness Overloaded',
  'Miya Buttreaks',
  'greywolfie',
  'Stripyrex',
  'thot_patrol',
  'intelligent_zombie',
  'A Supportive Bra',
  'Dil Chor',
  'Conqueror of Hearts',
  'Snacc Not Snack',
  'aldente',
  'hoot2Kill',
  'zero_deaths',
  'Glam Doll',
  'Robin D. Craydle',
];

const users = new Map<
  string,
  { users: { name: string; id: string }[]; available: string[] }
>();

const rooms = new Map<string, string[]>();

@WebSocketGateway(parseInt(process.env.SOCKET_PORT) || 4001, {
  cors: { origin: ['http://localhost:3000'] },
})
export class CollageGateway {
  constructor(private collageService: CollageService) {}

  @SubscribeMessage('join')
  public async join(
    @MessageBody() collageId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(collageId);

    rooms.set(client.id, [...client.rooms]);

    const index = Math.floor(Math.random() * names.length);
    const randomName = names[index];
    const newAvailable = [...names.slice(0, index), ...names.slice(index + 1)];

    if (users.has(collageId)) {
      users.set(collageId, {
        users: [
          ...users.get(collageId).users,
          { name: randomName, id: client.id },
        ],
        available: newAvailable,
      });
    } else {
      users.set(collageId, {
        users: [{ name: randomName, id: client.id }],
        available: newAvailable,
      });
    }

    const room = users.get(collageId);

    // отправляем всем
    client.to(collageId).emit('joined', room.users);
    // отправляем отправителю
    client.emit(
      'joined',
      room.users.map((u) =>
        u.name === randomName ? { ...u, me: true } : { ...u },
      ),
    );
  }

  @SubscribeMessage('updateCollage')
  public async updateCollage(
    @MessageBody() collageId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const collage = await this.collageService.getById(collageId);

    // отправляем всем
    client.to(collageId).emit('updatedCollage', collage);
    // отправляем отправителю
    client.emit('updatedCollage', collage);
  }

  handleDisconnect(client: Socket) {
    rooms.get(client.id)?.forEach((collageId) => {
      const room = users.get(collageId);

      if (!room) {
        return;
      }

      const user = room.users.find((u) => u.id === client.id);
      if (!user) {
        return;
      }

      const newAvailable = [...room?.available, user.name];
      const newUsers = room.users.filter((u) => u.name !== user.name);

      users.set(collageId, { users: newUsers, available: newAvailable });

      // отправляем всем
      client.to(collageId).emit('left', users.get(collageId).users);
    });
  }
}
