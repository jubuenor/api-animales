import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Animale from 'App/Models/Animale';

export default class AnimalesController {
    public async setRegistrarAnimal({request,response}:HttpContextContract){
        const dataAnimal = request.only(['codigo_animal','nombre_animal','especie','raza','genero','edad']);
        try{
            const codigoAnimal = dataAnimal.codigo_animal;
            const animalExistente: Number=await this.getValidarAnimalExistente(codigoAnimal);
            if(animalExistente==0){
                await Animale.create(dataAnimal)
                response.status(200).json({"msg":"Registro completado con exito"})
            }else{
                response.status(400).json({"msg":"Error, el codigo de animal ya se encuentra registrado"});
            }
            
        }catch(r){
            response.status(500).json({"msg":"Error en el servidor!!"});
        }
        
    }

    private async getValidarAnimalExistente(codigo_animal:Number):Promise<Number>{
        const total = await Animale.query().where({"codigo_animal":codigo_animal}).count('*').from('animales');
        return parseInt(total[0]["count(*)"]);
    }
    public async listarAnimales():Promise<Animale[]>{
        const animal = await Animale.all();
        return animal;
    }
    public async actualizarAnimal({request}:HttpContextContract){
        const id = request.param('id');
        const animal = request.all();
        await Animale.query().where('codigo_animal',id).update({
            nombre_animal:animal.nombre_animal,
            especie:animal.especie,
            raza:animal.raza,
            genero:animal.genero,
            edad:animal.edad
        })
        return {"msg":"Registro actualizado","estado":"200"};
    }
    public async filtrarEspecie({request}:HttpContextContract){
        const especie = request.param('especie');
        const animales= await Animale.query().where('especie','like',especie);
        return animales;
    }
    public async filtrarEdad(){
        const animales= await Animale.query().where('edad','<',8);
        return animales;
    }
    public async eliminarAnimal({request}:HttpContextContract){
        const id= request.param('id');
        await Animale.query().where('codigo_animal',id).delete();
        return("Registro eliminado");
    }
}
