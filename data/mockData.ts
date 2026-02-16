
import { Brokerage, Agent, Policy, Client, Installment, InstallmentStatus, PolicyStatus, User, Claim, Quote, Prospect, Task, ClaimStatus, QuoteStatus, ProspectStatus, TaskStatus, Insurer, RenewalStatus, Attachment, PolicyNotification, ActivityLog, Commission, Incentive } from '../types';

const rawCsvData = `Sseguro;Numero Poliza;Numero item;Gerente Red;Codigo Sucursal;Nombre Sucursal;Rut Corredor;Nombre Corredor;Rut Contratante;Nombre Contratante;Rut Asegurado;Nombre Asegurado;Nombre Producto;Nombre Ramo;Valor Prima;Estado Poliza;Fecha Emision;Fecha Inicio Vigencia;Fecha Fin Vigencia;Plan Pago;Cuota;Cantidad Cuotas;Fecha Vencimiento;Valor Capital;Tasa Interes;Cuota Neta;Monto Afecto;Iva;Monto Exento;Interes Bruto;Iva Interes;Valor Cuota;Estado Cuota;Folio Mandato;Estado Mandato;Forma de Pago;Fecha Pago;Recaudacion UF;Cuota Pesos;CoAsegurado;Poliza Squadra Directo;Moneda Origen
9178404;100079798;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;77681212-9;GASTRONÓMICA VITACURA SP;77681212-9;GASTRONÓMICA VITACURA SP;Incendio Riesgo Nominado comercial UF;Incendio;23,45;VIGENTE;09/05/2025;05/05/2025;05/05/2026;1297035;1;8;05/06/2025;21,66;0,44;2,76;1,16;0,22;1,5;0,1;0,02;3;Pagada;0;;Aviso;02/07/2025;3;117817;NO ES COASEGURO;NO;UF
9178404;100079798;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;77681212-9;GASTRONÓMICA VITACURA SP;77681212-9;GASTRONÓMICA VITACURA SP;Incendio Riesgo Nominado comercial UF;Incendio;23,45;VIGENTE;09/05/2025;05/05/2025;05/05/2026;1361358;2;8;05/07/2025;18,99;0,44;2,76;1,17;0,22;1,51;0,08;0,02;3;Pagada;0;;Aviso;11/08/2025;3;117421;NO ES COASEGURO;NO;UF
9178404;100079798;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;77681212-9;GASTRONÓMICA VITACURA SP;77681212-9;GASTRONÓMICA VITACURA SP;Incendio Riesgo Nominado comercial UF;Incendio;23,45;VIGENTE;09/05/2025;05/05/2025;05/05/2026;1361358;3;8;05/08/2025;16,31;0,44;2,76;1,17;0,22;1,51;0,07;0,01;3;Pendiente;0;;Aviso;;0;0;NO ES COASEGURO;NO;UF
9179305;100079853;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;78606640-9;GASTRONOMICA AMIGO MIO LTDA;78606640-9;GASTRONOMICA AMIGO MIO LTDA;Incendio Riesgo Nominado comercial UF;Incendio;19,61;VIGENTE;11/08/2025;05/05/2025;05/05/2026;1361612;1;8;05/07/2025;18,1;0,44;2,31;0,97;0,18;1,26;0,08;0,02;2,51;Pagada;0;;Aviso;11/08/2025;2,51;98278;NO ES COASEGURO;NO;UF
9179305;100079853;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;78606640-9;GASTRONOMICA AMIGO MIO LTDA;78606640-9;GASTRONOMICA AMIGO MIO LTDA;Incendio Riesgo Nominado comercial UF;Incendio;19,61;VIGENTE;11/08/2025;05/05/2025;05/05/2026;1361612;2;8;05/08/2025;15,87;0,44;2,31;0,98;0,19;1,26;0,07;0,01;2,51;Pendiente;0;;Aviso;;0;0;NO ES COASEGURO;NO;UF
8985537;300455680;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76570339-5;Mon key Adventure SPA;76570339-5;Mon key Adventure SPA;Auto Flotas;Vehiculos;92,54;VENCIDA;25/10/2023;25/10/2023;25/10/2024;1181181;3;10;05/01/2024;79,43;0,93;10,35;9,61;1,83;0;0,74;0,14;12,32;Pagada;0;;Aviso;24/01/2024;12,32;472945;NO ES COASEGURO;NO;UF
8985537;300455680;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76570339-5;Mon key Adventure SPA;76570339-5;Mon key Adventure SPA;Auto Flotas;Vehiculos;92,54;VENCIDA;25/10/2023;25/10/2023;25/10/2024;1181181;4;10;05/02/2024;69,82;0,93;10,35;9,7;1,84;0;0,65;0,12;12,32;Pagada;0;;Aviso;19/02/2024;12,32;474310;NO ES COASEGURO;NO;UF
8985537;300455680;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76570339-5;Mon key Adventure SPA;76570339-5;Mon key Adventure SPA;Auto Flotas;Vehiculos;92,54;VENCIDA;25/10/2023;25/10/2023;25/10/2024;1181181;5;10;05/03/2024;60,12;0,93;10,35;9,79;1,86;0;0,56;0,11;12,32;Pagada;0;;Aviso;20/03/2024;12,32;478330;NO ES COASEGURO;NO;UF
8985537;300455680;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76570339-5;Mon key Adventure SPA;76570339-5;Mon key Adventure SPA;Auto Flotas;Vehiculos;92,54;VENCIDA;25/10/2023;25/10/2023;25/10/2024;1298479;6;10;05/04/2024;50,33;0,93;10,35;9,88;1,88;0;0,47;0,09;12,32;Pagada;0;;Aviso;12/05/2024;12,32;481564;NO ES COASEGURO;NO;UF
8985537;300455680;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76570339-5;Mon key Adventure SPA;76570339-5;Mon key Adventure SPA;Auto Flotas;Vehiculos;92,54;VENCIDA;25/10/2023;25/10/2023;25/10/2024;1298479;7;10;05/05/2024;40,45;0,93;10,35;9,97;1,89;0;0,38;0,07;12,32;Pagada;0;;Aviso;13/05/2024;12,32;481809;NO ES COASEGURO;NO;UF
8985537;300455680;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76570339-5;Mon key Adventure SPA;76570339-5;Mon key Adventure SPA;Auto Flotas;Vehiculos;92,54;VENCIDA;25/10/2023;25/10/2023;25/10/2024;1298479;8;10;05/06/2024;30,48;0,93;10,35;10,07;1,91;0;0,28;0,05;12,32;Vencida;0;;Aviso;;0;0;NO ES COASEGURO;NO;UF
9263349;100081566;0;ADRIAN JOSE AGUILERA;106;Viña del Ma;76082437-2;CORREDORA DE SEGUROS E ASESORIAS JUAN ANDRES VALDES E.I.R.L.;76933672-9;Compañía de Polietileno S;76933672-9;Compañía de Polietileno S;Incendio Riesgo Nominado comercial UF;Incendio;531,57;VIGENTE;02/07/2024;30/06/2024;30/06/2025;1335111;1;8;05/08/2024;488;0,44;62,21;28,23;5,36;31,84;2,15;0,41;67,98;Pendiente;0;;Aviso;;0;0;NO ES COASEGURO;NO;UF`;

const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr || dateStr.trim() === '') return undefined;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // new Date(year, monthIndex, day)
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return undefined;
};
  
const parseFloatComma = (numStr: string): number => {
    if (!numStr) return 0;
    return parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
};

export const mockInsurers: Insurer[] = [
    { id: 'insurer-1', name: 'Liberty Seguros' },
    { id: 'insurer-2', name: 'Sura Seguros' },
    { id: 'insurer-3', name: 'Consorcio' },
];

const processCsvData = () => {
    const policiesMap = new Map<string, Policy>();
    const clientsMap = new Map<string, Client>();
    const agentsMap = new Map<string, Agent>();
    const brokeragesMap = new Map<string, Brokerage>();
    
    const mainBrokerage: Brokerage = { id: '76082437-2', name: 'JUAN ANDRES VALDES E.I.R.L.' };
    brokeragesMap.set(mainBrokerage.id, mainBrokerage);

    const rows = rawCsvData.trim().split('\n').slice(1);

    rows.forEach((row, index) => {
        const columns = row.split(';');

        const clientId = columns[8];
        if (clientId && !clientsMap.has(clientId)) {
            clientsMap.set(clientId, { id: clientId, name: columns[9] });
        }

        const agentId = columns[6];
        if (agentId && !agentsMap.has(agentId)) {
            agentsMap.set(agentId, { id: agentId, name: columns[7], brokerageId: mainBrokerage.id });
        }

        const policyNumber = columns[1];
        if (policyNumber && !policiesMap.has(policyNumber)) {
            const endDate = parseDate(columns[18]) || new Date();
            const issueDate = parseDate(columns[16]) || new Date();
            
            let status: PolicyStatus;
            if (columns[15] === 'VIGENTE' && endDate < new Date()) {
                status = 'VENCIDA';
            } else {
                status = columns[15] as PolicyStatus;
            }

            const renewalDate = new Date(endDate);
            renewalDate.setDate(renewalDate.getDate() + 1);

            const renewalStatusOptions: RenewalStatus[] = ['Pendiente', 'Renovada', 'No Renovada'];
            
            const attachments: Attachment[] = index % 3 === 0 ? [
                { id: `att-${policyNumber}-1`, filename: 'propuesta_firmada.pdf', url: '#', uploadedAt: issueDate, fileType: 'pdf' },
                { id: `att-${policyNumber}-2`, filename: 'foto_vehiculo.jpg', url: '#', uploadedAt: issueDate, fileType: 'image' },
            ] : [];

            const notifications: PolicyNotification[] = endDate < new Date() && status === 'VENCIDA' ? [
                { id: `notif-${policyNumber}-1`, message: `La póliza ha vencido. Contactar al cliente para renovación.`, date: endDate, read: false }
            ] : [];

            const activityLog: ActivityLog[] = [
                { id: `log-${policyNumber}-1`, description: `Póliza emitida por ${columns[7]}.`, date: issueDate, user: 'Sistema' },
                { id: `log-${policyNumber}-2`, description: 'Propuesta enviada al cliente.', date: new Date(new Date(issueDate).setDate(issueDate.getDate() - 5)), user: 'John Doe' },
            ];

            const newPolicy: Policy = {
                id: `${columns[0]}-${policyNumber}`,
                policyNumber: policyNumber,
                product: columns[12],
                lineOfBusiness: columns[13],
                issueDate: issueDate,
                startDate: parseDate(columns[17]) || new Date(),
                endDate: endDate,
                policyHolderId: clientId,
                insuredId: columns[10],
                totalPremium: parseFloatComma(columns[14]),
                status: status,
                currency: columns[41] as 'UF' | 'CLP',
                agentId: agentId,
                brokerageId: mainBrokerage.id,
                installments: [],
                insurerId: mockInsurers[index % mockInsurers.length].id,
                renewalDate: renewalDate,
                renewalStatus: renewalStatusOptions[index % renewalStatusOptions.length],
                attachments,
                notifications,
                activityLog,
            };
            policiesMap.set(policyNumber, newPolicy);
        }

        const policy = policiesMap.get(policyNumber);
        if (policy) {
            const dueDate = parseDate(columns[22]) || new Date();
            let status: InstallmentStatus = columns[32] as InstallmentStatus;
            if(status === 'Pendiente' && dueDate < new Date()) {
                status = 'Vencida';
            }

            const installment: Installment = {
                id: `${policyNumber}-${columns[20]}`,
                policyNumber: policyNumber,
                installmentNumber: parseInt(columns[20], 10),
                totalInstallments: parseInt(columns[21], 10),
                dueDate: dueDate,
                paymentDate: parseDate(columns[36]),
                netAmount: parseFloatComma(columns[25]),
                tax: parseFloatComma(columns[27]) + parseFloatComma(columns[30]),
                interest: parseFloatComma(columns[29]),
                totalAmount: parseFloatComma(columns[31]),
                status: status,
                currency: columns[41] as 'UF' | 'CLP'
            };
            policy.installments.push(installment);
        }
    });

    return {
        policies: Array.from(policiesMap.values()),
        clients: Array.from(clientsMap.values()),
        agents: Array.from(agentsMap.values()),
        brokerages: Array.from(brokeragesMap.values())
    };
}

const csvData = processCsvData();
const now = new Date();

export const mockUsers: User[] = [
    { id: 'u1', name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Activo', lastLogin: new Date(2024, 4, 25, 10, 30) },
    { id: 'u2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Gerente', status: 'Activo', lastLogin: new Date(2024, 4, 24, 15, 0) },
    { id: 'a1', name: 'JUAN ANDRES VALDES E.I.R.L.', email: 'jvaldes@example.com', role: 'Agente', status: 'Activo', lastLogin: new Date(2024, 4, 25, 9, 0) },
    { id: 'a2', name: 'Carlos Díaz', email: 'cdiaz@example.com', role: 'Agente', status: 'Activo', lastLogin: new Date(2024, 4, 25, 9, 15) },
    { id: 'a3', name: 'Benjamín Soto', email: 'bsoto@example.com', role: 'Agente', status: 'Inactivo', lastLogin: new Date(2024, 3, 20, 18, 0) },
];

// --- Add more varied mock data for better UI demonstration ---
const extraBrokerages: Brokerage[] = [{ id: 'b2', name: 'BrokerMax Chile' }];
const extraAgents: Agent[] = [
    { id: 'a2', name: 'Carlos Díaz', brokerageId: 'b2', managerId: 'u2' }, // Managed by Jane Smith (Gerente)
    { id: 'a3', name: 'Benjamín Soto', brokerageId: 'b2', managerId: 'u2' }, // Managed by Jane Smith (Gerente)
];
const extraClients: Client[] = [
    { id: '76.123.456-7', name: 'Comercial ABC Ltda' },
    { id: '99.876.543-2', name: 'Inversiones XYZ SpA' }
];

const extraPolicies: Policy[] = [];

// Create 60 policies over the last 24 months
for (let i = 0; i < 60; i++) {
    const agent = extraAgents[i % extraAgents.length];
    const client = extraClients[i % extraClients.length];
    const currency = (i % 3) === 0 ? 'UF' : 'CLP';

    const issueDate = new Date(now);
    issueDate.setMonth(now.getMonth() - (i % 24));
    issueDate.setDate(15 - (i % 10)); // Vary the day a bit

    const startDate = new Date(issueDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    const totalPremium = currency === 'UF' ? (i * 5 + 20) : (i * 50000 + 100000);
    const policyStatus = endDate > now ? 'VIGENTE' : 'VENCIDA';

    const policy: Policy = {
        id: `pol-extra-${i}`,
        policyNumber: `9000${i}`,
        product: i % 3 === 0 ? 'Seguro de Vida' : (i % 3 === 1 ? 'SOAP' : 'Salud'),
        lineOfBusiness: i % 3 === 0 ? 'Vida' : (i % 3 === 1 ? 'Vehículos' : 'Salud'),
        issueDate,
        startDate,
        endDate,
        policyHolderId: client.id,
        insuredId: client.id,
        totalPremium,
        status: policyStatus,
        currency,
        agentId: agent.id,
        brokerageId: agent.brokerageId,
        installments: [],
        insurerId: mockInsurers[i % mockInsurers.length].id,
        renewalDate: new Date(endDate.getTime() + 86400000), // one day after end
        renewalStatus: i % 3 === 0 ? 'Renovada' : 'Pendiente',
        attachments: i % 4 === 0 ? [{ id: `att-extra-${i}`, filename: `condiciones_particulares.pdf`, url: '#', uploadedAt: issueDate, fileType: 'pdf' }] : [],
        notifications: i > 55 ? [{ id: `notif-extra-${i}`, message: 'Aviso de pago de cuota próximo a vencer.', date: now, read: false }] : [],
        activityLog: [{ id: `log-extra-${i}`, description: `Póliza emitida por ${agent.name}.`, date: issueDate, user: 'Sistema' }],
    };
    
    const totalInstallments = 12;
    for (let j = 1; j <= totalInstallments; j++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + j - 1);
        
        let status: InstallmentStatus = 'Pendiente';
        let paymentDate: Date | undefined = undefined;

        if (dueDate < now) {
            // 80% chance of being paid if due in the past
            if (Math.random() < 0.8) {
                status = 'Pagada';
                paymentDate = new Date(dueDate);
                paymentDate.setDate(dueDate.getDate() + 5); // Paid 5 days after due
            } else {
                status = 'Vencida';
            }
        }

        policy.installments.push({
            id: `${policy.id}-inst-${j}`,
            policyNumber: policy.policyNumber,
            installmentNumber: j,
            totalInstallments,
            dueDate,
            paymentDate,
            totalAmount: totalPremium / totalInstallments,
            netAmount: (totalPremium / totalInstallments) * 0.8,
            tax: (totalPremium / totalInstallments) * 0.19,
            interest: 0,
            status,
            currency,
        });
    }
    extraPolicies.push(policy);
}

// Combine data from CSV and extra mock data
export const mockPolicies = [...csvData.policies, ...extraPolicies];
export const mockClients = [...csvData.clients, ...extraClients];
export const mockAgents = [...csvData.agents, ...extraAgents];
export const mockBrokerages = [...csvData.brokerages, ...extraBrokerages];


export const mockClaims: Claim[] = mockPolicies.slice(0, 15).map((p, index) => {
    const statuses: ClaimStatus[] = ['Abierto', 'En Proceso', 'Cerrado', 'Rechazado'];
    const notificationDate = new Date(p.startDate);
    notificationDate.setMonth(notificationDate.getMonth() + (index % 6) + 1);

    return {
        id: `claim-${index}`,
        claimNumber: `SIN-00${index + 1}`,
        policyNumber: p.policyNumber,
        policyHolderId: p.policyHolderId,
        notificationDate: notificationDate,
        lineOfBusiness: p.lineOfBusiness,
        claimedAmount: p.currency === 'UF' ? 10 * (index + 1) : 500000 * (index + 1),
        status: statuses[index % statuses.length],
        currency: p.currency,
    };
});

export const mockQuotes: Quote[] = mockClients.slice(0, 20).map((c, index) => {
    const statuses: QuoteStatus[] = ['Borrador', 'Enviada', 'Aceptada', 'Rechazada'];
    const currency = index % 2 === 0 ? 'UF' : 'CLP';
    const creationDate = new Date();
    creationDate.setDate(creationDate.getDate() - (index * 3));
    
    return {
        id: `quote-${index}`,
        quoteNumber: `COT-00${index + 1}`,
        clientId: c.id,
        product: index % 3 === 0 ? 'Seguro de Vida' : 'Auto Flotas',
        premium: currency === 'UF' ? 50 + index : 1500000 + (index * 10000),
        status: statuses[index % statuses.length],
        currency: currency,
        creationDate: creationDate,
    };
});

export const mockProspects: Prospect[] = [
    { id: 'p1', name: 'Constructora XYZ', contact: 'Ana García', email: 'ana.g@constructoraxyz.com', phone: '+56987654321', agentId: 'a2', status: 'Calificado', pipelineValue: 12500000, lastContacted: new Date(new Date().setDate(now.getDate() - 5)), attachments: [{ id: 'att-p1-1', filename: 'presentacion_corporativa.pdf', url: '#', uploadedAt: new Date(), fileType: 'pdf' }], activityLog: [{id: 'log-p1-1', description: 'Prospecto Creado', date: new Date(new Date().setDate(now.getDate() - 6)), user: 'Carlos Díaz'}] },
    { id: 'p2', name: 'Transportes Rápidos Ltda.', contact: 'Pedro Pascal', email: 'ppascal@transportes.cl', phone: '+56912345678', agentId: 'a3', status: 'Contactado', pipelineValue: 8000000, lastContacted: new Date(new Date().setDate(now.getDate() - 20)), attachments: [], activityLog: [{id: 'log-p2-1', description: 'Llamada inicial realizada.', date: new Date(new Date().setDate(now.getDate() - 20)), user: 'Benjamín Soto'}] },
    { id: 'p3', name: 'Viña del Sol', contact: 'María Rodriguez', email: 'm.rodriguez@vinadelsol.com', phone: '+56955554444', agentId: 'a1', status: 'Nuevo', pipelineValue: 25000000, lastContacted: new Date(new Date().setDate(now.getDate() - 1)), attachments: [], activityLog: [] },
    { id: 'p4', name: 'Agro-Industrias Green', contact: 'Juan Soto', email: 'jsoto@agrogreen.com', phone: '+56922334455', agentId: 'a2', status: 'Perdido', pipelineValue: 5000000, lastContacted: new Date(new Date().setMonth(now.getMonth() - 2)), attachments: [], activityLog: [] },
    { id: 'p5', name: 'Comercial ABC Ltda', contact: 'Carlos Vera', email: 'cvera@comercialabc.cl', phone: '+56911223344', agentId: 'a2', status: 'Ganado', pipelineValue: 15000000, lastContacted: new Date(new Date().setDate(now.getDate() - 10)), attachments: [], activityLog: [] },
];

export const mockTasks: Task[] = [
    { id: 't1', title: 'Contactar a Viña del Sol por cotización de flota', description: 'Llamar a María Rodriguez para seguimiento.', assignedToId: 'a1', createdById: 'u2', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2), status: 'Pendiente', prospectId: 'p3' },
    { id: 't2', title: 'Preparar presentación para Constructora XYZ', description: 'Enfocarse en seguros de ingeniería y responsabilidad civil.', assignedToId: 'a2', createdById: 'u2', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5), status: 'Pendiente', prospectId: 'p1' },
    { id: 't3', title: 'Enviar documentación a GASTRONÓMICA VITACURA', description: 'Póliza de incendio, certificado de cobertura.', assignedToId: 'a1', createdById: 'a1', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), status: 'Completada', policyId: mockPolicies[0].id },
    { id: 't4', title: 'Revisar siniestro de Mon key Adventure', description: 'Verificar documentación y contactar al liquidador.', assignedToId: 'u2', createdById: 'u1', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), status: 'En Progreso', policyId: csvData.policies.find(p => p.policyHolderId === '76570339-5')?.id },
    { id: 't5', title: 'Capacitación nuevo producto de Salud', description: 'Asistir a webinar de la aseguradora.', assignedToId: 'a3', createdById: 'u2', dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10), status: 'Pendiente' },
    { id: 't6', title: 'Seguimiento renovación póliza Comercial ABC', description: 'Contactar a Carlos Vera para confirmar renovación.', assignedToId: 'a2', createdById: 'a2', dueDate: new Date(new Date().setDate(now.getDate() + 3)), status: 'Pendiente', policyId: mockPolicies.find(p => p.agentId === 'a2')?.id },
    { id: 't7', title: 'Generar reporte de comisiones del mes', description: 'Preparar el informe mensual de comisiones para revisión.', assignedToId: 'a2', createdById: 'u2', dueDate: new Date(new Date().setDate(now.getDate() - 2)), status: 'Completada' },
];

// --- Generate Commissions Data ---
export const mockCommissions: Commission[] = [];
const commissionRate = 0.10; // 10%
const overrideRate = 0.025; // 2.5%
const allAgentsAndUsers = [...mockAgents, ...csvData.agents];

mockPolicies.forEach(policy => {
    policy.installments.forEach(inst => {
        if (inst.status === 'Pagada' && inst.paymentDate) {
            const commissionAmount = inst.totalAmount * commissionRate;
            
            // Determine type based on first installment vs others, and renewal status
            let type: 'Venta' | 'Renovación' = 'Venta';
            if(policy.renewalStatus === 'Renovada' && inst.installmentNumber > 1) {
                type = 'Renovación';
            }

            mockCommissions.push({
                id: `comm-${inst.id}`,
                policyId: policy.id,
                policyNumber: policy.policyNumber,
                installmentId: inst.id,
                agentId: policy.agentId,
                amount: commissionAmount,
                currency: inst.currency,
                type: type,
                calculationDate: inst.paymentDate,
            });

            // Check for override
            const agent = allAgentsAndUsers.find(a => a.id === policy.agentId);
            if (agent?.managerId) {
                 const overrideAmount = inst.totalAmount * overrideRate;
                 mockCommissions.push({
                    id: `comm-ovr-${inst.id}`,
                    policyId: policy.id,
                    policyNumber: policy.policyNumber,
                    installmentId: inst.id,
                    agentId: agent.managerId, // Commission for the manager
                    amount: overrideAmount,
                    currency: inst.currency,
                    type: 'Override',
                    calculationDate: inst.paymentDate,
                    relatedAgentId: agent.id, // Who generated the override
                 });
            }
        }
    });
});

// Add some Referido commissions
mockCommissions.push({
    id: `comm-ref-1`,
    policyId: mockPolicies[10].id,
    policyNumber: mockPolicies[10].policyNumber,
    installmentId: mockPolicies[10].installments[0].id,
    agentId: 'a3',
    amount: mockPolicies[10].installments[0].totalAmount * 0.01, // 1% referral fee
    currency: mockPolicies[10].currency,
    type: 'Referido',
    calculationDate: new Date(),
    relatedAgentId: mockPolicies[10].agentId,
});


export const mockIncentives: Incentive[] = [
    {
        id: 'inc-1',
        title: 'Bono de Producción "Salud"',
        description: 'Alcanza la meta de prima emitida en el ramo de Salud este trimestre.',
        target: 15000000,
        current: 7850000,
        reward: 'Bono de $500,000 CLP',
        metric: 'Prima',
        lineOfBusiness: 'Salud',
    },
    {
        id: 'inc-2',
        title: 'Campeón de Pólizas Nuevas',
        description: 'Emite la mayor cantidad de pólizas nuevas este mes para ganar.',
        target: 25,
        current: 18,
        reward: 'Gift Card de $250,000',
        metric: 'Pólizas',
    },
    {
        id: 'inc-3',
        title: 'Maestro de Vida',
        description: 'Supera la meta de producción en el ramo Vida y asegura tu premio.',
        target: 20000000,
        current: 21500000,
        reward: 'Viaje a congreso de ventas',
        metric: 'Prima',
        lineOfBusiness: 'Vida',
    }
];