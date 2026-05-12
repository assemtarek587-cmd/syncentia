import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AdValue {
  name?: string | null
  placement?: string | null
  slot_id?: string | null
  format?: string | null
  label?: string | null
  is_active?: boolean | null
}

interface AdFormProps {
  action: (formData: FormData) => Promise<void>
  ad?: AdValue
  submitLabel: string
}

const placements = [
  { value: 'home-top', label: 'Homepage' },
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'in-article', label: 'In Article' },
  { value: 'footer', label: 'Footer' },
]

const formats = ['auto', 'rectangle', 'horizontal', 'vertical']

export function AdForm({ action, ad, submitLabel }: AdFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={ad?.name || ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot_id">Google Slot ID</Label>
          <Input id="slot_id" name="slot_id" defaultValue={ad?.slot_id || ''} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="placement">Placement</Label>
          <select
            id="placement"
            name="placement"
            defaultValue={ad?.placement || 'home-top'}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {placements.map((placement) => (
              <option key={placement.value} value={placement.value}>
                {placement.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <select
            id="format"
            name="format"
            defaultValue={ad?.format || 'auto'}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" defaultValue={ad?.label || 'Advertisement'} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input name="is_active" type="checkbox" defaultChecked={ad?.is_active ?? true} />
        Active
      </label>

      <Button type="submit">{submitLabel}</Button>
    </form>
  )
}
