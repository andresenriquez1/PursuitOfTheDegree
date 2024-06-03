import { tiny } from './examples/common.js';
const { Shader } = tiny;

export class Custom_Face_Shader extends Shader {
    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        const [P, C, M] = [gpu_state.projection_transform, gpu_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));
        context.uniform4fv(gpu_addresses.shape_color, material.color);
        context.uniform1f(gpu_addresses.ambient, material.ambient);
        context.uniform1f(gpu_addresses.diffusivity, material.diffusivity);
        context.uniform1f(gpu_addresses.specularity, material.specularity);
        context.uniform1f(gpu_addresses.smoothness, material.smoothness);
        context.uniform1i(gpu_addresses.texture, 0);

        if (material.texture) {
            gpu_state.context.activeTexture(gpu_state.context.TEXTURE0);
            gpu_state.context.bindTexture(gpu_state.context.TEXTURE_2D, material.texture.id);
        }
    }

    shared_glsl_code() {
        return `precision mediump float;
                varying vec2 f_tex_coord;
                varying vec4 vertex_color;
                `;
    }

    vertex_glsl_code() {
        return `
            attribute vec3 position, normal;
            attribute vec2 texture_coord;
            uniform mat4 projection_camera_model_transform;
            uniform mat4 model_transform;
            uniform mat4 inverse_transpose_modelview;
            varying vec2 f_tex_coord;
            void main() {
                gl_Position = projection_camera_model_transform * vec4(position, 1.0);
                f_tex_coord = texture_coord;
            }`;
    }

    fragment_glsl_code() {
        return `
            uniform sampler2D texture;
            uniform bool use_texture;
            varying vec2 f_tex_coord;
            void main() {
                vec4 tex_color = texture2D(texture, f_tex_coord);
                if (use_texture && abs(gl_FrontFacing - 1.0) < 0.001)
                    gl_FragColor = tex_color;
                else
                    gl_FragColor = vec4(1, 1, 1, 1);
            }`;
    }
}
