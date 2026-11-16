/** Esquema Zod del Libro de Reclamaciones (validación autoritativa en la Server Action). */
import { z } from "zod";
import { educativoFuente } from "@/content/educativo-fuente";
import { DOC_RE, LIBRO_MSG } from "./libro";
import { CELULAR_RE } from "./validacion";

const L = educativoFuente.libro;
const req = z.string().trim().min(1, LIBRO_MSG.requerido);
const opt = z.string().trim().optional().default("");
const enumDe = (xs: readonly string[]) => z.string().refine((x) => xs.includes(x), LIBRO_MSG.requerido);
const doc = (tipo: string, nro: string) => !!DOC_RE[tipo]?.test(nro);

export const libroSchema = z
  .object({
    nombres: req,
    paterno: req,
    materno: req,
    tipo_doc: enumDe(L.tiposDocumento),
    nro_doc: req,
    cel: z.string().transform((x) => x.replace(/\D/g, "")).pipe(z.string().regex(CELULAR_RE, LIBRO_MSG.celular)),
    dep: enumDe(L.departamentos),
    prov: req,
    dist: req,
    direccion: req,
    referencia: opt,
    correo: z.string().trim().pipe(z.email(LIBRO_MSG.correo)),
    flag_menor: z.enum(["si", "no"]).default("no"),
    nombre_tutor: opt,
    correo_tutor: opt,
    tipo_doc_tutor: opt,
    nro_doc_tutor: opt,
    tipo_reclamo: enumDe(L.tiposReclamo),
    tipo_consumo: enumDe(L.tiposConsumo),
    nro_pedido: req,
    proveedor: opt,
    monto_reclamado: z.string().trim().refine((x) => !x || /^\d{1,7}(\.\d{1,2})?$/.test(x), LIBRO_MSG.monto),
    descripcion: req,
    fch_compra: opt,
    fch_consumo: opt,
    fch_vencimiento: opt,
    detalle_reclamo: z.string().trim().min(20, LIBRO_MSG.detalleCorto),
    pedido_cliente: req,
    declaro: z.literal("on", { error: LIBRO_MSG.declaro }),
    acepto: z.literal("on", { error: LIBRO_MSG.acepto }),
    empresa: z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (!doc(d.tipo_doc, d.nro_doc)) ctx.addIssue({ code: "custom", path: ["nro_doc"], message: LIBRO_MSG.documento });
    if (d.flag_menor === "si") {
      if (!d.nombre_tutor) ctx.addIssue({ code: "custom", path: ["nombre_tutor"], message: LIBRO_MSG.requerido });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.correo_tutor))
        ctx.addIssue({ code: "custom", path: ["correo_tutor"], message: LIBRO_MSG.correo });
      if (!doc(d.tipo_doc_tutor, d.nro_doc_tutor))
        ctx.addIssue({ code: "custom", path: ["nro_doc_tutor"], message: LIBRO_MSG.documento });
    }
  });
