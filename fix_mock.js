const fs = require('fs');
const path = require('path');

const dir = 'd:/JUNEINTERN/frontend/src/pages/departments';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('Login') && f !== 'HrPortal.tsx' && f !== 'HRPortal.tsx'); // Skip HR portal as we already did custom wiring there

const newHook = `function useDataStore(key: string, initialData?: any[]) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getDeptStore(key).then(res => {
            if (mounted && res && Array.isArray(res)) {
                setData(res);
            }
        }).catch(err => console.error(err))
        .finally(() => { if(mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [key]);

    const api = useMemo(() => ({
        async add(item: any) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = [...prev, item];
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it));
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
        },
        async remove(matchFn: (it: any) => boolean) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = prev.filter(it => !matchFn(it));
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
        },
    }), [key]);

    return { data, setData, api, loading };
}`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Add API imports if needed
    if (!content.includes('getDeptStore')) {
        content = content.replace(/import\s+\{[^}]*\}\s+from\s+'react';/, (match) => {
            return match + `\nimport { getDeptStore, saveDeptStore } from '../../services/api';`;
        });
    }

    // 2. Replace useDataStore hook
    const hookRegex = /function useDataStore[\s\S]*?return \{ data, setData, api, loading \};\r?\n\}/;
    
    if (hookRegex.test(content)) {
        content = content.replace(hookRegex, newHook);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated ' + file);
    } else {
        console.log('Could not find hook in ' + file);
    }
}
