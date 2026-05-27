import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Medicamento } from '../types/Medicamento';
import { getPromociones } from '../services/promociones.service';
import { subscribeMedicamentos } from '../services/medicamentos.service';

interface DataContextValue {
	medicamentos: Medicamento[];
	promociones: any[];
	loadingMedicamentos: boolean;
	loadingPromociones: boolean;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
	const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
	const [promociones, setPromociones] = useState<any[]>([]);
	const [loadingMedicamentos, setLoadingMedicamentos] = useState(true);
	const [loadingPromociones, setLoadingPromociones] = useState(true);

	useEffect(() => {
		const unsubscribe = subscribeMedicamentos((nextMedicamentos) => {
			setMedicamentos(nextMedicamentos as Medicamento[]);
			setLoadingMedicamentos(false);
		}, () => {
			setLoadingMedicamentos(false);
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		let mounted = true;

		getPromociones()
			.then((data) => {
				if (!mounted) return;
				setPromociones(data as any[]);
			})
			.catch((error) => {
				console.error('Error loading promociones:', error);
			})
			.finally(() => {
				if (mounted) {
					setLoadingPromociones(false);
				}
			});

		return () => {
			mounted = false;
		};
	}, []);

	const value = useMemo(
		() => ({
			medicamentos,
			promociones,
			loadingMedicamentos,
			loadingPromociones,
		}),
		[medicamentos, promociones, loadingMedicamentos, loadingPromociones]
	);

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
	const context = useContext(DataContext);

	if (!context) {
		throw new Error('useData must be used within a DataProvider');
	}

	return context;
}
