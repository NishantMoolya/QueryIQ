import React, { useState } from 'react'
import { Card } from '../card'
import { Database, FileText } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

const SourceCard = ({ src_type = 'db', data, handleSelect, isSelected = false }) => {
    const [checked, setChecked] = useState(isSelected);
    const toggleChecked = () => {
        setChecked((prev) => {
            handleSelect(data?._id, prev);
            return !prev;
        });
    }

    return (
        <Card onClick={toggleChecked} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                        {src_type === 'db' ? <Database className="w-4 h-4 text-white" /> : <FileText className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{data?.file_name || 'Source'}</p>
                    </div>
                </div>
                <Checkbox checked={checked} onCheckedChange={toggleChecked} />
            </div>
        </Card>
    )
}

export default SourceCard