import { BaseInfoInterface } from '@commands/base/interfaces/base-info.interface'

export interface UploadCommandDataInterface {
  name: BaseInfoInterface['title']
  description: BaseInfoInterface['description']
  options: BaseInfoInterface['options']
  default_permission: BaseInfoInterface['defaultPermission']
}
