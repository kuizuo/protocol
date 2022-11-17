import type { DataTableColumns } from 'naive-ui'
import { NTag, useMessage } from 'naive-ui'

import { h } from 'vue'

const { copy, copied } = useClipboard()

export const columns: DataTableColumns<API.Ticket> = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '卡密',
    key: 'no',
    width: 300,
    ellipsis: true,
    render(row) {
      const message = useMessage()

      const no = row.no
      return h(
        NTag,
        {
          type: 'info',
          bordered: false,
          onClick: async () => {
            await copy(no)
            if (copied.value)
              v
            message.success('复制成功')
          },
        },
        {
          default: () => no,
        },
      )
    },
  },
  {
    title: '是否使用',
    key: 'used',
    filterOptions: [
      {
        label: '已使用',
        value: 1,
      },
      {
        label: '未使用',
        value: 0,
      },
    ],
    filter(value, row) {
      return row.used === !!value
    },
    render(row) {
      const type = row.used ? 'error' : 'success'
      const message = row.used ? '已使用' : '未使用'
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type,
          bordered: false,
        },
        {
          default: () => message,
        },
      )
    },
  },
  {
    title: '使用时间',
    key: 'usedTime',
    sorter: true,
    render(row, index) {
      if (row.usedTime) {
        const format = useDateFormat(row.usedTime ?? '', 'YYYY-MM-DD HH:mm:ss')
        return h('span', ['', format.value])
      }
      return ''
    },
  },
]
