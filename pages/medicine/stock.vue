<script lang="ts" setup>
import { NAvatar, NButton, NTag, useMessage } from 'naive-ui'
import type { DataTableColumns, DataTableRowKey, FormInst, UploadFileInfo } from 'naive-ui'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import ListIcon from '~icons/carbon/list'

definePageMeta({
  layout: 'dashboard',
  title: '药品库存列表',
  icon: ListIcon,
  order: 4,
})

const columns: DataTableColumns<API.Medicine> = [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: '药品',
    key: 'name',
  },
  {
    title: '类型',
    key: 'type.name',
  },
  {
    title: '图片',
    key: 'img',
    render(row) {
      return h(
        NAvatar,
        {
          src: row.img,
          size: 'medium',
        },
      )
    },

  },
  {
    title: '标签',
    key: 'tags',
    render(row) {
      const tags = row.tags?.split(',')?.map((tagKey) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '4px',
            },
            type: 'info',
            bordered: false,
          },
          {
            default: () => tagKey,
          },
        )
      })
      return tags
    },
  },
  {
    title: '描述',
    key: 'medDesc',
  },
  {
    title: '价格',
    key: 'price',
  },
  {
    title: '库存',
    key: 'stockNum',
  },
  {
    title: '生产批号',
    key: 'batchNumber',
  },
  {
    title: '生产日期',
    key: 'manufactureDate',
  },
  {
    width: 140,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            style: {
              marginRight: '6px',
              marginBottom: '2px',
            },
            size: 'small',
            type: 'info',
            onClick: () => handleSell(row),
          },
          { default: () => '销售' },
        ),
        h(
          NButton,
          {
            style: {
              marginRight: '6px',
              marginBottom: '2px',

            },
            size: 'small',
            type: 'info',
            onClick: () => handlePurchase(row),
          },
          { default: () => '进货' },
        ), h(
          NButton,
          {
            style: {
              marginRight: '6px',
            },
            size: 'small',
            type: 'warning',
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑' },
        ),
        h(
          NButton,
          {
            style: {
              marginRight: '6px',
            },
            size: 'small',
            type: 'error',
            onClick: () => handleDelete(row),
          },
          { default: () => '删除' },
        )]
    },
  },
]

const message = useMessage()

let showModal = $ref(false)
let title = $ref('')
let isEdit = $ref(false)

const formRef = $ref<FormInst | null>()
const form = reactive({
  id: -1,
  name: '',
  img: '',
  tags: '',
  medDesc: '',
  price: 0,
  stockNum: 0,
  batchNumber: '', // 批号
  manufactureDate: null, // 生产日期
  purchaseDate: '2022-12-18', // 进货日期
  shelfLife: 0, // 保质期
  isOtc: false, // 是否处方药
  typeId: -1,
})
const rowKey = (row: RowData) => row.no
const checkedRowKeys = ref<DataTableRowKey[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})
let formBtnLoading = $ref(false)

const showPreviewModal = ref(false)
const previewImageUrl = ref('')

const previewFileList = ref<UploadFileInfo[]>([
])

const handleFinish = ({
  file,
  event,
}: {
  file: UploadFileInfo
  event?: ProgressEvent
}) => {
  const json = JSON.parse(event!.target!.response)

  const src = json.data.src

  form.img = src
  return file
}

const { data, refresh, error } = await useAsyncData('medicine-list', async () => {
  const response = await request<API.Result>('/api/medicine/page', {
    method: 'GET',
    params: {
      page: pagination.current,
      pageSize: pagination.pageSize,
    },
  })
  return response.data.medicineList
})

const { data: typeList } = await useAsyncData('medicine-type-list', async () => {
  const response = await request<API.Result>('/api/medicine/type/list', {
    method: 'GET',
  })
  return response.data.map((d: any) => {
    return {
      label: d.name,
      value: d.id,
    }
  })
})

async function handleAdd() {
  title = '添加'
  showModal = true
  isEdit = false
  form.id = -1
  form.name = ''
  form.img = ''
  previewFileList.value = []
  form.tags = ''
  form.medDesc = ''
  form.price = 0
  form.stockNum = 0
  form.batchNumber = ''
  form.manufactureDate = null
  form.shelfLife = 0
  form.typeId = 1
}

async function handleEdit(record: API.Medicine) {
  title = '编辑'
  showModal = true
  isEdit = true
  form.id = record.id
  form.name = record.name
  form.img = record.img
  previewFileList.value = [{
    id: record.id.toString(),
    name: record.name,
    status: 'finished',
    url: record.img,
  }]
  form.tags = record.tags
  form.price = record.price
  form.stockNum = record.stockNum
  form.medDesc = record.medDesc
  form.batchNumber = record.batchNumber
  form.manufactureDate = record.manufactureDate
  form.shelfLife = record.shelfLife
  form.typeId = record.type.id
}

async function confirmForm(e: Event) {
  e.preventDefault()
  formBtnLoading = true

  try {
    const url = isEdit ? '/api/medicine/update' : '/api/medicine/add'
    await request(url, {
      method: 'POST',
      body: form,
    })
    message.success('操作成功')
    showModal = false

    refresh()
  }
  catch (error) {
    message.error((error as Error).message)
  }
  finally {
    formBtnLoading = false
  }
}

async function handleDelete(record: API.Medicine) {
  try {
    await request(`/api/medicine/remove?id=${record.id}`, {
      method: 'POST',
    })

    message.success('删除成功')
    refresh()
  }
  catch (error) {
    message.error((error as Error).message)
  }
}

let showSellModal = $ref(false)
const selltitle = $ref('')
let isSell = $ref(false)
const formSellRef = $ref<FormInst | null>()
const formSell = reactive({
  actualPayments: 0,
  id: -1,
  medIds: [],
  quantitySold: [],
  note: '',
})

async function handlePurchase(record: API.Medicine) {
  showSellModal = true
  isSell = false

  formSell.medIds = [record.id]
  formSell.note = '进货'
}

async function handleSell(record: API.Medicine) {
  showSellModal = true
  isSell = true

  formSell.medIds = [record.id]
  formSell.note = '销售'
}

async function confirmSellForm(e: Event) {
  e.preventDefault()
  formBtnLoading = true

  try {
    const url = isSell ? '/api/medicine/sell' : '/api/medicine/purchase'

    await request(url, {
      method: 'POST',
      body: {
        ...formSell,
        quantitySold: [formSell.quantitySold],
      },
    })
    message.success('操作成功')
    showSellModal = false

    refresh()
  }
  catch (error) {
    message.error((error as Error).message)
  }
  finally {
    formBtnLoading = false
  }
}

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeys.value = rowKeys
}

function handlePreview(file: UploadFileInfo) {
  const { url } = file
  previewImageUrl.value = url as string
  showPreviewModal.value = true
}
</script>

<template>
  <PageWrapper>
    <PageHeader />
    <PageBody>
      <NRow :gutter="12">
        <NCol :span="12">
          <NSpace justify="start" mb-2>
            <!-- 刷新 -->
            <NTooltip trigger="hover">
              <template #trigger>
                <div @click="refresh()">
                  <NIcon size="18">
                    <i i-carbon-restart text-gray-8 inline-block cursor-pointer select-none opacity-75 transition hover:opacity-100 hover:text-blue-600 />
                  </NIcon>
                </div>
              </template>
              <span>刷新</span>
            </NTooltip>
          </NSpace>
        </NCol>
        <NCol :span="12">
          <NSpace justify="end" align="center" mb-2>
            <NButton type="info" @click="handleAdd">
              添加
            </NButton>
          </NSpace>
        </NCol>
      </NRow>
      <NDataTable
        :columns="columns"
        :data="data"
        :row-key="rowKey"
        :pagination="pagination"
        @update:checked-row-keys="handleCheck"
      />
      <NModal v-model:show="showModal" :show-icon="false" preset="dialog" :title="title">
        <NForm
          ref="formRef"
          :model="form"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <NFormItem label="药品名">
            <NInput
              v-model:value="form.name"
              placeholder="请输入药品名"
            />
          </NFormItem>
          <NFormItem label="图片">
            <n-upload
              action="/upload"
              :default-file-list="previewFileList"
              list-type="image-card"
              @finish="handleFinish"
              @preview="handlePreview"
            />
          </NFormItem>
          <NFormItem label="药品类型">
            <NSelect
              v-model:value="form.typeId"
              :options="typeList"
              placeholder="请输入药品类型"
            />
          </NFormItem>
          <NFormItem label="标签">
            <NInput
              v-model:value="form.tags"
              placeholder="请输入药品标签"
            />
          </NFormItem>
          <NFormItem label="价格">
            <NInputNumber
              v-model:value="form.price"
              placeholder="请输入药品价格"
            />
          </NFormItem>
          <NFormItem label="库存">
            <NInputNumber
              v-model:value="form.stockNum"
              placeholder="请输入库存数量"
            />
          </NFormItem>
          <NFormItem label="药品批号">
            <NInput
              v-model:value="form.batchNumber"
              placeholder="请输入药品批号"
            />
          </NFormItem>
          <NFormItem label="生产日期">
            <n-date-picker v-model:formatted-value="form.manufactureDate" value-format="yyyy-MM-dd" type="date" />
          </NFormItem>
          <NFormItem label="保质期">
            <NInput
              v-model:value="form.shelfLife"
              placeholder="请输入保质期"
            />
          </NFormItem>
          <NFormItem label="描述">
            <NInput
              v-model:value="form.medDesc"
              placeholder="请输入药品描述"
            />
          </NFormItem>
        </NForm>

        <template #action>
          <NSpace>
            <NButton @click="() => (showModal = false)">
              取消
            </NButton>
            <NButton type="info" @click="confirmForm">
              确定
            </NButton>
          </NSpace>
        </template>
      </NModal>
      <NModal v-model:show="showSellModal" :show-icon="false" preset="dialog" :title="title">
        <NForm
          ref="formSellRef"
          :model="formSell"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <NFormItem label="数量">
            <NInputNumber
              v-model:value="formSell.quantitySold"
              placeholder="请输入数量"
            />
          </NFormItem>
          <NFormItem label="盈亏额">
            <NInputNumber
              v-model:value="formSell.actualPayments"
              placeholder="请输入盈亏额"
            />
          </NFormItem>
          <NFormItem label="备注">
            <NInput
              v-model:value="formSell.note"
              placeholder="请输入备注"
            />
          </NFormItem>
        </NForm>

        <template #action>
          <NSpace>
            <NButton @click="() => (showSellModal = false)">
              取消
            </NButton>
            <NButton type="info" @click="confirmSellForm">
              确定
            </NButton>
          </NSpace>
        </template>
      </NModal>

      <NModal
        v-model:show="showPreviewModal"
        preset="card"
        style="width: 600px"
        title="预览图"
      >
        <img :src="previewImageUrl" style="width: 100%">
      </NModal>
    </PageBody>
  </PageWrapper>
</template>
