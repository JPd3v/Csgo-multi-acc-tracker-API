import type { IUser } from '../../types';

// declare global {
//   namespace Express {
//     interface User {
//       name: string;
//     }
//   }
// }
// declare global {
//   namespace Express {
//     export interface Request {
//       currentUser: IUser;
//       user: IUser;
//     }
//   }
// }

declare global {
  namespace Express {
    // NOTE FIX LATER
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUser {}
  }
}
