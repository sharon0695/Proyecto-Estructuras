import { useMemo, useState } from "react";
import { Pila } from "../structures/pila";
import type { Medicamento } from "../types/Medicamento";

const STORAGE_KEY = "farmaciaRHistorial";
const MAX_HISTORY = 6;

function readStoredHistory(): Medicamento[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (!stored) return [];

		return JSON.parse(stored) as Medicamento[];
	} catch (error) {
		console.error("Error loading history:", error);
		return [];
	}
}

export function useHistorial() {
	const [pila] = useState(() => new Pila<Medicamento>());
	const [historial, setHistorial] = useState<Medicamento[]>(() => {
		const initial = readStoredHistory();
		initial.forEach((item) => pila.apilar(item));
		return initial;
	});

	const registrarVisto = (medicamento: Medicamento) => {
		const filtrado = historial.filter((item) => item.id !== medicamento.id);
		const nextHistory = [medicamento, ...filtrado].slice(0, MAX_HISTORY);

		pila.limpiar();
		nextHistory.slice().reverse().forEach((item) => pila.apilar(item));
		setHistorial(nextHistory);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
		} catch (err) {
			console.error('Error saving history', err);
		}
	};

	const limpiarHistorial = () => {
		pila.limpiar();
		setHistorial([]);
	};

	return useMemo(
		() => ({
			historial,
			registrarVisto,
			limpiarHistorial,
		}),
		[historial]
	);
}